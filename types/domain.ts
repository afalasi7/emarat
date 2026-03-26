export type PrayerName =
  | "Fajr"
  | "Sunrise"
  | "Dhuhr"
  | "Asr"
  | "Maghrib"
  | "Isha";

export type PrayerStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "scheduled"
  | "missed";

export interface PrayerTime {
  id: string;
  name: PrayerName;
  adhanTime: string;
  note: string;
  status: PrayerStatus;
  completed: boolean;
  reminderEnabled: boolean;
}

export interface Reminder {
  id: string;
  prayerName: PrayerName;
  label: string;
  offsetMinutes: number;
  enabled: boolean;
  mode: "soft-adhan" | "vibration" | "desktop-banner";
}

export interface UserSettings {
  calculationMethod: string;
  madhab: "Hanafi" | "Shafi";
  language: string;
  themePreference: "system" | "light" | "dark";
  quietMode: boolean;
  travelMode: boolean;
  notificationWindowMinutes: number;
}

export interface Device {
  id: string;
  name: string;
  kind: "phone" | "watch" | "desktop";
  synced: boolean;
  lastActive: string;
}

export interface QiblaData {
  city: string;
  directionLabel: string;
  degrees: number;
  alignmentState: "adjusting" | "aligned";
  precisionMeters: number;
  travelDistanceKm: number;
  guidance: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  passwordSalt: string;
  passwordHash: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
}

export interface OverviewData {
  hijriDate: string;
  location: string;
  nextPrayerLabel: string;
  rhythmCards: Array<{
    title: string;
    description: string;
    metaLeft?: string | undefined;
    metaRight?: string | undefined;
  }>;
  stats: Array<{
    label: string;
    value: string;
  }>;
  upcoming: {
    label: string;
    time: string;
  };
}

export interface DesktopOverviewData {
  heroLeft: {
    title: string;
    description: string;
  };
  heroRight: {
    title: string;
    description: string;
  };
  insight: {
    title: string;
    description: string;
    points: string[];
  };
}

export interface BackendState {
  overview: OverviewData;
  desktopOverview: DesktopOverviewData;
  prayerTimes: PrayerTime[];
  qibla: QiblaData;
  reminders: Reminder[];
  settings: UserSettings;
  devices: Device[];
  users: AuthUser[];
  sessions: SessionRecord[];
}
