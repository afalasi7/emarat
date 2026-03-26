import {
  mockDesktopOverview,
  mockDevices,
  mockOverview,
  mockPrayerTimes,
  mockQiblaData,
  mockReminders,
  mockUserSettings,
} from "@/lib/mock-data";
import { backendStateSchema } from "@/lib/schemas";
import type { BackendState } from "@/types/domain";

const demoUser = {
  id: "user-demo",
  email: "you@example.com",
  name: "Emarat Demo",
  passwordSalt: "emarat-demo-salt",
  passwordHash:
    "e7e907a92430b0be0671ce3203a74bb2b649896884fa848dd78ba7c092d3313731496a9071cb4778d0370422fe2afe4ad064f4d972abb56c0a41829957598350",
} as const;

export const seedBackendState = backendStateSchema.parse({
  overview: mockOverview,
  desktopOverview: mockDesktopOverview,
  prayerTimes: mockPrayerTimes,
  qibla: mockQiblaData,
  reminders: mockReminders,
  settings: mockUserSettings,
  devices: mockDevices,
  users: [demoUser],
  sessions: [],
}) satisfies BackendState;
