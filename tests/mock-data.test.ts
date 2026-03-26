import { describe, expect, it } from "vitest";
import {
  mockDesktopOverview,
  mockDevices,
  mockOverview,
  mockPrayerTimes,
  mockQiblaData,
  mockReminders,
  mockUserSettings,
} from "@/lib/mock-data";

describe("mock data contracts", () => {
  it("exposes validated prayer and reminder data", () => {
    expect(mockPrayerTimes).toHaveLength(6);
    expect(mockReminders).toHaveLength(3);
    expect(mockUserSettings.themePreference).toBe("system");
  });

  it("exposes validated qibla and overview data", () => {
    expect(mockQiblaData.directionLabel).toBe("Turn right 14°");
    expect(mockOverview.rhythmCards).toHaveLength(2);
    expect(mockDesktopOverview.insight.points.length).toBeGreaterThan(0);
    expect(mockDevices.every((device) => device.synced)).toBe(true);
  });
});
