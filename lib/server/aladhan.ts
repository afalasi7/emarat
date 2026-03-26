import { z } from "zod";
import { getCountdownLabel } from "@/lib/prayer";
import { buildDirectionLabel, getDirectionDelta } from "@/lib/qibla";
import type { PrayerName, PrayerTime } from "@/types/domain";

const aladhanTimingsSchema = z.object({
  Fajr: z.string().min(1),
  Sunrise: z.string().min(1),
  Dhuhr: z.string().min(1),
  Asr: z.string().min(1),
  Maghrib: z.string().min(1),
  Isha: z.string().min(1),
});

const aladhanTimingsResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.object({
    timings: aladhanTimingsSchema,
    date: z.object({
      readable: z.string().min(1),
      hijri: z.object({
        date: z.string().min(1),
        day: z.string().min(1),
        month: z.object({
          en: z.string().min(1),
        }),
        year: z.string().min(1),
      }),
    }),
  }),
});

const aladhanQiblaResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.object({
    direction: z.number(),
  }),
});

const prayerNameMap = {
  Fajr: "Fajr",
  Sunrise: "Sunrise",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
} as const satisfies Record<PrayerName, keyof z.infer<typeof aladhanTimingsSchema>>;

const prayerOrder: PrayerName[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

const DEFAULT_TIMEOUT_MS = 6_000;
const DEFAULT_METHOD = 2;
const DEFAULT_CITY = "Dubai";
const DEFAULT_COUNTRY = "UAE";
const DEFAULT_LATITUDE = 25.2048;
const DEFAULT_LONGITUDE = 55.2708;

export interface LivePrayerSnapshotInput {
  city?: string | undefined;
  country?: string | undefined;
  method?: number | undefined;
  fallbackPrayerTimes?: PrayerTime[] | undefined;
}

export interface LiveQiblaInput {
  deviceHeading: number;
  latitude?: number | undefined;
  longitude?: number | undefined;
}

export interface LivePrayerSnapshot {
  city: string;
  country: string;
  dateReadable: string;
  hijriLabel: string;
  prayerTimes: PrayerTime[];
}

export interface LiveQiblaSnapshot {
  directionLabel: string;
  degrees: number;
  alignmentState: "adjusting" | "aligned";
}

export async function getLivePrayerSnapshot(
  input: LivePrayerSnapshotInput,
) {
  const city = input.city ?? DEFAULT_CITY;
  const country = input.country ?? DEFAULT_COUNTRY;
  const method = Number.isFinite(input.method)
    ? Math.trunc(input.method ?? DEFAULT_METHOD)
    : DEFAULT_METHOD;

  const searchParams = new URLSearchParams({
    city,
    country,
    method: String(method),
  });

  const endpoint = `https://api.aladhan.com/v1/timingsByCity?${searchParams.toString()}`;
  const payload = await fetchAladhanPayload(
    endpoint,
    aladhanTimingsResponseSchema,
  );

  if (!payload) {
    return null;
  }

  return {
    city,
    country,
    dateReadable: payload.data.date.readable,
    hijriLabel: `${payload.data.date.hijri.day} ${payload.data.date.hijri.month.en}`,
    prayerTimes: mapAladhanPrayerTimes(
      payload.data.timings,
      new Date(),
      input.fallbackPrayerTimes ?? [],
    ),
  } satisfies LivePrayerSnapshot;
}

export async function getLiveQiblaSnapshot(input: LiveQiblaInput) {
  const latitude = Number.isFinite(input.latitude)
    ? input.latitude
    : DEFAULT_LATITUDE;
  const longitude = Number.isFinite(input.longitude)
    ? input.longitude
    : DEFAULT_LONGITUDE;

  const endpoint = `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`;
  const payload = await fetchAladhanPayload(
    endpoint,
    aladhanQiblaResponseSchema,
  );

  if (!payload) {
    return null;
  }

  const bearing = payload.data.direction;
  const degrees = getDirectionDelta(input.deviceHeading, bearing);

  return {
    directionLabel: buildDirectionLabel(input.deviceHeading, bearing),
    degrees,
    alignmentState: degrees <= 2 ? "aligned" : "adjusting",
  } satisfies LiveQiblaSnapshot;
}

export function mapAladhanPrayerTimes(
  timings: z.infer<typeof aladhanTimingsSchema>,
  now: Date,
  fallbackPrayerTimes: PrayerTime[] = [],
) {
  const fallbackByPrayer = new Map(
    fallbackPrayerTimes.map((prayer) => [prayer.name, prayer]),
  );
  const entries = prayerOrder.map((name) => {
    const normalized = normalizeApiClock(timings[prayerNameMap[name]]);
    return {
      name,
      adhanTime: toMeridiemTime(normalized),
      clock: normalized,
    };
  });

  const nextIndex = findNextPrayerIndex(entries.map((entry) => entry.clock), now);

  return entries.map((entry, index) => {
    const fallback = fallbackByPrayer.get(entry.name);
    const offset = (index - nextIndex + entries.length) % entries.length;
    const reminderEnabled = fallback?.reminderEnabled ?? true;
    const completed = fallback?.completed ?? false;
    const status = resolveStatus(offset, completed);
    const note =
      offset === 0
        ? `Upcoming in ${getCountdownLabel(entry.adhanTime, now)} · ${
            reminderEnabled ? "reminder on" : "reminder off"
          }`
        : (fallback?.note ?? defaultNote(entry.name, reminderEnabled));

    return {
      id: fallback?.id ?? entry.name.toLowerCase(),
      name: entry.name,
      adhanTime: entry.adhanTime,
      note,
      status,
      completed,
      reminderEnabled,
    } satisfies PrayerTime;
  });
}

export function getNextPrayerLabel(prayerTimes: PrayerTime[], now = new Date()) {
  const nextPrayer = findNextPrayer(prayerTimes, now);
  if (!nextPrayer) {
    return "Prayer schedule unavailable";
  }

  return `${nextPrayer.name} in ${getCountdownLabel(nextPrayer.adhanTime, now)}`;
}

async function fetchAladhanPayload<T>(
  url: string,
  schema: z.ZodSchema<T>,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    return schema.parse(payload);
  } catch {
    return null;
  }
}

function normalizeApiClock(rawClock: string) {
  const match = rawClock.match(/\d{1,2}:\d{2}/);
  if (!match) {
    throw new Error(`Unexpected prayer time format: ${rawClock}`);
  }
  const [hours, minutes] = match[0].split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new Error(`Unexpected prayer time format: ${rawClock}`);
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toMeridiemTime(clock: string) {
  const [hoursRaw, minutesRaw] = clock.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = ((hours + 11) % 12) + 1;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )} ${suffix}`;
}

function findNextPrayerIndex(clocks: string[], now: Date) {
  const timeline = clocks.map((clock) => getDateFromClock(clock, now));
  const nowMs = now.getTime();
  const currentIndex = timeline.findIndex((time) => time.getTime() > nowMs);
  return currentIndex >= 0 ? currentIndex : 0;
}

function getDateFromClock(clock: string, baseDate: Date) {
  const [hoursPart, minutesPart] = clock.split(":");
  const hoursRaw = Number(hoursPart);
  const minutesRaw = Number(minutesPart);
  if (!Number.isFinite(hoursRaw) || !Number.isFinite(minutesRaw)) {
    throw new Error(`Invalid clock value: ${clock}`);
  }

  const date = new Date(baseDate);
  date.setHours(hoursRaw, minutesRaw, 0, 0);
  return date;
}

function resolveStatus(offset: number, completed: boolean) {
  if (offset === 0) {
    return "current";
  }
  if (completed) {
    return "completed";
  }
  if (offset === 1) {
    return "upcoming";
  }

  return "scheduled";
}

function defaultNote(prayerName: PrayerName, reminderEnabled: boolean) {
  return reminderEnabled
    ? `${prayerName} reminder enabled`
    : `${prayerName} reminder off`;
}

function findNextPrayer(prayerTimes: PrayerTime[], now: Date) {
  if (prayerTimes.length === 0) {
    return null;
  }

  const nextPrayer =
    prayerTimes.find((prayer) => {
      const date = parseMeridiemTime(prayer.adhanTime, now);
      return date.getTime() > now.getTime();
    }) ?? prayerTimes[0];

  return nextPrayer ?? null;
}

function parseMeridiemTime(value: string, baseDate: Date) {
  const [timePart, meridiem] = value.split(" ");
  if (!timePart || !meridiem) {
    throw new Error(`Invalid meridiem time: ${value}`);
  }

  const [hoursPart, minutesPart] = timePart.split(":");
  const hoursRaw = Number(hoursPart);
  const minutesRaw = Number(minutesPart);
  if (!Number.isFinite(hoursRaw) || !Number.isFinite(minutesRaw)) {
    throw new Error(`Invalid meridiem time: ${value}`);
  }

  let hours = hoursRaw;
  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }
  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date(baseDate);
  date.setHours(hours, minutesRaw, 0, 0);
  return date;
}
