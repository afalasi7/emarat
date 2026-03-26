import { z } from "zod";

export const prayerNameSchema = z.enum([
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
]);

export const prayerStatusSchema = z.enum([
  "completed",
  "current",
  "upcoming",
  "scheduled",
  "missed",
]);

export const themePreferenceSchema = z.enum(["system", "light", "dark"]);

export const prayerTimeSchema = z.object({
  id: z.string().min(1),
  name: prayerNameSchema,
  adhanTime: z.string().min(1),
  note: z.string().min(1),
  status: prayerStatusSchema,
  completed: z.boolean(),
  reminderEnabled: z.boolean(),
});

export const reminderSchema = z.object({
  id: z.string().min(1),
  prayerName: prayerNameSchema,
  label: z.string().min(1),
  offsetMinutes: z.number().int(),
  enabled: z.boolean(),
  mode: z.enum(["soft-adhan", "vibration", "desktop-banner"]),
});

export const userSettingsSchema = z.object({
  calculationMethod: z.string().min(1),
  madhab: z.enum(["Hanafi", "Shafi"]),
  language: z.string().min(1),
  themePreference: themePreferenceSchema,
  quietMode: z.boolean(),
  travelMode: z.boolean(),
  notificationWindowMinutes: z.number().int().nonnegative(),
});

export const deviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["phone", "watch", "desktop"]),
  synced: z.boolean(),
  lastActive: z.string().min(1),
});

export const qiblaDataSchema = z.object({
  city: z.string().min(1),
  directionLabel: z.string().min(1),
  degrees: z.number().int().nonnegative(),
  alignmentState: z.enum(["adjusting", "aligned"]),
  precisionMeters: z.number().nonnegative(),
  travelDistanceKm: z.number().nonnegative(),
  guidance: z.string().min(1),
});

export const overviewSchema = z.object({
  hijriDate: z.string().min(1),
  location: z.string().min(1),
  nextPrayerLabel: z.string().min(1),
  rhythmCards: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      metaLeft: z.string().optional(),
      metaRight: z.string().optional(),
    }),
  ),
  stats: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    }),
  ),
  upcoming: z.object({
    label: z.string().min(1),
    time: z.string().min(1),
  }),
});

export const desktopOverviewSchema = z.object({
  heroLeft: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  heroRight: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  insight: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    points: z.array(z.string().min(1)).min(1),
  }),
});

export const authUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  passwordSalt: z.string().min(1),
  passwordHash: z.string().min(1),
});

export const sessionUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
});

export const sessionRecordSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  tokenHash: z.string().min(1),
  createdAt: z.string().min(1),
  expiresAt: z.string().min(1),
});

export const backendStateSchema = z.object({
  overview: overviewSchema,
  desktopOverview: desktopOverviewSchema,
  prayerTimes: prayerTimeSchema.array(),
  qibla: qiblaDataSchema,
  reminders: reminderSchema.array(),
  settings: userSettingsSchema,
  devices: deviceSchema.array(),
  users: authUserSchema.array(),
  sessions: sessionRecordSchema.array(),
});

export const signInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const settingsUpdateSchema = userSettingsSchema.partial();

export const reminderUpdateSchema = z
  .object({
    enabled: z.boolean(),
    label: z.string().min(1),
    offsetMinutes: z.number().int(),
  })
  .partial();
