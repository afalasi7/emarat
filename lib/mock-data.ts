import {
  desktopOverviewSchema,
  deviceSchema,
  overviewSchema,
  prayerTimeSchema,
  qiblaDataSchema,
  reminderSchema,
  userSettingsSchema,
} from "@/lib/schemas";
import type {
  Device,
  PrayerTime,
  QiblaData,
  Reminder,
  UserSettings,
} from "@/types/domain";

export const mockPrayerTimes: PrayerTime[] = prayerTimeSchema.array().parse([
  {
    id: "fajr",
    name: "Fajr",
    adhanTime: "04:52 AM",
    note: "Checked in before sunrise · 41m early",
    status: "completed",
    completed: true,
    reminderEnabled: true,
  },
  {
    id: "sunrise",
    name: "Sunrise",
    adhanTime: "06:18 AM",
    note: "Sunrise window available for reflection",
    status: "scheduled",
    completed: false,
    reminderEnabled: false,
  },
  {
    id: "dhuhr",
    name: "Dhuhr",
    adhanTime: "12:21 PM",
    note: "Upcoming in 03:44 · reminder on",
    status: "current",
    completed: false,
    reminderEnabled: true,
  },
  {
    id: "asr",
    name: "Asr",
    adhanTime: "03:33 PM",
    note: "Focus mode enabled · 12 min reminder",
    status: "upcoming",
    completed: false,
    reminderEnabled: true,
  },
  {
    id: "maghrib",
    name: "Maghrib",
    adhanTime: "06:41 PM",
    note: "Adhan with soft chime · route aware",
    status: "scheduled",
    completed: false,
    reminderEnabled: true,
  },
  {
    id: "isha",
    name: "Isha",
    adhanTime: "08:03 PM",
    note: "Quiet hours respected with a low-light reminder",
    status: "scheduled",
    completed: false,
    reminderEnabled: true,
  },
]);

export const mockReminders: Reminder[] = reminderSchema.array().parse([
  {
    id: "r-1",
    prayerName: "Maghrib",
    label: "Quiet reminder",
    offsetMinutes: -12,
    enabled: true,
    mode: "vibration",
  },
  {
    id: "r-2",
    prayerName: "Asr",
    label: "Kickoff prompt",
    offsetMinutes: -18,
    enabled: true,
    mode: "desktop-banner",
  },
  {
    id: "r-3",
    prayerName: "Fajr",
    label: "Soft adhan",
    offsetMinutes: 0,
    enabled: true,
    mode: "soft-adhan",
  },
]);

export const mockDevices: Device[] = deviceSchema.array().parse([
  {
    id: "device-phone",
    name: "iPhone 16 Pro",
    kind: "phone",
    synced: true,
    lastActive: "2 min ago",
  },
  {
    id: "device-watch",
    name: "Apple Watch",
    kind: "watch",
    synced: true,
    lastActive: "11 min ago",
  },
  {
    id: "device-desktop",
    name: "MacBook Desktop",
    kind: "desktop",
    synced: true,
    lastActive: "now",
  },
]);

export const mockUserSettings: UserSettings = userSettingsSchema.parse({
  calculationMethod: "UAE method",
  madhab: "Hanafi",
  language: "English",
  themePreference: "system",
  quietMode: true,
  travelMode: false,
  notificationWindowMinutes: 12,
});

export const mockQiblaData: QiblaData = qiblaDataSchema.parse({
  city: "Dubai",
  directionLabel: "Turn right 14°",
  degrees: 14,
  alignmentState: "adjusting",
  precisionMeters: 18,
  travelDistanceKm: 4980,
  guidance:
    "If the marker drifts left, turn left. Keep rotating until the Kaaba appears.",
});

export const mockOverview = overviewSchema.parse({
  hijriDate: "12 Rabi I",
  location: "Mosque Street, Dubai",
  nextPrayerLabel: "Asr in 01:12",
  rhythmCards: [
    {
      title: "Fajr completed",
      description: "2 of 5 prayers checked today",
      metaLeft: "Last check-in 5:14 AM",
      metaRight: "40% complete",
    },
    {
      title: "Quiet reminder",
      description: "Vibration only before Maghrib, with travel time buffer",
    },
  ],
  stats: [
    { label: "7 day streak", value: "Consistency this week" },
    { label: "31° clear", value: "Clear skies before sunset" },
  ],
  upcoming: {
    label: "Dhuhr reminder",
    time: "11:56 AM",
  },
});

export const mockDesktopOverview = desktopOverviewSchema.parse({
  heroLeft: {
    title: "Asr in 01:12",
    description: "Smart reminders are active for today's remaining prayers.",
  },
  heroRight: {
    title: "Sunset 6:41 PM",
    description: "Desktop glance view for office and home prayer pacing.",
  },
  insight: {
    title: "Prayer readiness",
    description:
      "Desk mode balances time-to-prayer, commute buffer, and notification intensity.",
    points: [
      "Routes, shared components, tests, and layout parity.",
      "Pixel-faithful screens, clean lint/tests, and reusable settings.",
    ],
  },
});
