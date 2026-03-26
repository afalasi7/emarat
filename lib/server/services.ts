import {
  getLivePrayerSnapshot,
  getLiveQiblaSnapshot,
  getNextPrayerLabel,
} from "@/lib/server/aladhan";
import { mockQiblaBearingService } from "@/lib/qibla";
import {
  reminderUpdateSchema,
  settingsUpdateSchema,
  signInRequestSchema,
  signUpRequestSchema,
} from "@/lib/schemas";
import {
  createPasswordSalt,
  createSessionToken,
  hashSessionToken,
  hashPassword,
  verifyPassword,
} from "@/lib/server/auth";
import { readDatabase, updateDatabase } from "@/lib/server/database";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const DEFAULT_ALADHAN_COUNTRY = "UAE";
const DEFAULT_ALADHAN_METHOD = 2;
const DEFAULT_ALADHAN_LATITUDE = 25.2048;
const DEFAULT_ALADHAN_LONGITUDE = 55.2708;

export async function getOverviewData() {
  const db = await readDatabase();
  const location = getPrayerLocation(db.qibla.city);
  const liveSnapshot = await getLivePrayerSnapshot({
    ...location,
    fallbackPrayerTimes: db.prayerTimes,
  });
  if (!liveSnapshot) {
    return db.overview;
  }

  const now = new Date();
  const nextPrayerLabel = getNextPrayerLabel(liveSnapshot.prayerTimes, now);

  return {
    ...db.overview,
    hijriDate: liveSnapshot.hijriLabel,
    location: `${liveSnapshot.city}, ${liveSnapshot.country}`,
    nextPrayerLabel,
    upcoming: {
      label: "Next prayer",
      time:
        liveSnapshot.prayerTimes.find((prayer) => prayer.status === "current")
          ?.adhanTime ?? db.overview.upcoming.time,
    },
  };
}

export async function getDesktopOverviewData() {
  const db = await readDatabase();
  return db.desktopOverview;
}

export async function getPrayerTimesData() {
  const db = await readDatabase();
  const location = getPrayerLocation(db.qibla.city);
  const liveSnapshot = await getLivePrayerSnapshot({
    ...location,
    fallbackPrayerTimes: db.prayerTimes,
  });

  const prayerTimes = liveSnapshot?.prayerTimes ?? db.prayerTimes;

  return {
    prayerTimes,
    settings: db.settings,
    reminders: db.reminders,
    source: liveSnapshot ? "aladhan" : "local",
  };
}

export async function getQiblaData(deviceHeading = 245) {
  const db = await readDatabase();
  const coordinates = getQiblaCoordinates();
  const liveQibla = await getLiveQiblaSnapshot({
    deviceHeading,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });

  if (liveQibla) {
    return {
      ...db.qibla,
      ...liveQibla,
    };
  }

  const fallbackQibla = await mockQiblaBearingService.getQiblaData({
    deviceHeading,
  });
  return {
    ...db.qibla,
    ...fallbackQibla,
  };
}

export async function getSettingsBundle() {
  const db = await readDatabase();
  return {
    settings: db.settings,
    reminders: db.reminders,
    devices: db.devices,
  };
}

export async function getDevices() {
  const db = await readDatabase();
  return db.devices;
}

export async function getReminders() {
  const db = await readDatabase();
  return db.reminders;
}

export async function updateSettings(input: unknown) {
  const patch = settingsUpdateSchema.parse(input);
  const db = await updateDatabase((current) => ({
    ...current,
    settings: assignDefined(current.settings, patch),
  }));
  return db.settings;
}

export async function updateReminder(reminderId: string, input: unknown) {
  const patch = reminderUpdateSchema.parse(input);
  const db = await updateDatabase((current) => ({
    ...current,
    reminders: current.reminders.map((reminder) =>
      reminder.id === reminderId
        ? assignDefined(reminder, patch)
        : reminder,
    ),
  }));
  const reminder = db.reminders.find((entry) => entry.id === reminderId);
  if (!reminder) {
    throw new Error("Reminder not found");
  }
  return reminder;
}

export async function signIn(input: unknown) {
  const credentials = signInRequestSchema.parse(input);
  const db = await readDatabase();
  const user = db.users.find((entry) => entry.email === credentials.email);
  if (
    !user ||
    !verifyPassword({
      password: credentials.password,
      salt: user.passwordSalt,
      expectedHash: user.passwordHash,
    })
  ) {
    throw new Error("Invalid credentials");
  }

  const sessionToken = await persistSession(user.id);

  return {
    sessionToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function signUp(input: unknown) {
  const nextUser = signUpRequestSchema.parse(input);
  const db = await readDatabase();

  if (db.users.some((user) => user.email === nextUser.email)) {
    throw new Error("An account with this email already exists");
  }

  const passwordSalt = createPasswordSalt();
  const createdUser = {
    id: `user-${Date.now()}`,
    email: nextUser.email,
    name: nextUser.name,
    passwordSalt,
    passwordHash: hashPassword(nextUser.password, passwordSalt),
  };

  await updateDatabase((current) => ({
    ...current,
    users: [...current.users, createdUser],
  }));

  const sessionToken = await persistSession(createdUser.id);

  return {
    sessionToken,
    user: {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    },
  };
}

export async function getSessionUser(sessionToken: string | undefined) {
  if (!sessionToken) {
    return null;
  }

  const now = new Date();
  const tokenHash = hashSessionToken(sessionToken);
  const db = await readDatabase();
  const activeSession = pruneExpiredSessions(db.sessions, now).find(
    (session) => session.tokenHash === tokenHash,
  );

  if (!activeSession) {
    return null;
  }

  const user = db.users.find((entry) => entry.id === activeSession.userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function signOut(sessionToken: string | undefined) {
  if (!sessionToken) {
    return;
  }

  const tokenHash = hashSessionToken(sessionToken);
  await updateDatabase((current) => ({
    ...current,
    sessions: current.sessions.filter((session) => session.tokenHash !== tokenHash),
  }));
}

function assignDefined<T extends object>(
  target: T,
  patch: Partial<{ [K in keyof T]: T[K] | undefined }>,
) {
  const next = { ...target } as T;

  for (const [key, value] of Object.entries(patch) as Array<
    [keyof T, T[keyof T] | undefined]
  >) {
    if (value !== undefined) {
      next[key] = value as T[keyof T];
    }
  }

  return next;
}

function pruneExpiredSessions<
  T extends {
    expiresAt: string;
  },
>(sessions: T[], now: Date) {
  return sessions.filter((session) => new Date(session.expiresAt).getTime() > now.getTime());
}

async function persistSession(userId: string) {
  const now = new Date();
  const sessionToken = createSessionToken();
  const sessionRecord = {
    id: `session-${now.getTime()}`,
    userId,
    tokenHash: hashSessionToken(sessionToken),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };

  await updateDatabase((current) => ({
    ...current,
    sessions: [...pruneExpiredSessions(current.sessions, now), sessionRecord],
  }));

  return sessionToken;
}

function getPrayerLocation(defaultCity: string) {
  const city = process.env.EMARAT_CITY ?? defaultCity;
  const country = process.env.EMARAT_COUNTRY ?? DEFAULT_ALADHAN_COUNTRY;
  const parsedMethod = Number(process.env.EMARAT_PRAYER_METHOD ?? DEFAULT_ALADHAN_METHOD);

  return {
    city,
    country,
    method: Number.isFinite(parsedMethod) ? parsedMethod : DEFAULT_ALADHAN_METHOD,
  };
}

function getQiblaCoordinates() {
  const latitude = Number(process.env.EMARAT_LATITUDE ?? DEFAULT_ALADHAN_LATITUDE);
  const longitude = Number(process.env.EMARAT_LONGITUDE ?? DEFAULT_ALADHAN_LONGITUDE);

  return {
    latitude: Number.isFinite(latitude) ? latitude : DEFAULT_ALADHAN_LATITUDE,
    longitude: Number.isFinite(longitude) ? longitude : DEFAULT_ALADHAN_LONGITUDE,
  };
}
