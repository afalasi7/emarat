import { describe, expect, it } from "vitest";
import {
  formatPrayerTime,
  getCountdownLabel,
  getPrayerCompletionSummary,
} from "@/lib/prayer";
import { mockPrayerTimes } from "@/lib/mock-data";

describe("prayer utilities", () => {
  it("formats prayer times for display", () => {
    expect(formatPrayerTime("04:52 AM")).toBe("4:52 AM");
  });

  it("computes countdown labels", () => {
    const now = new Date(2026, 2, 24, 8, 0, 0);
    expect(getCountdownLabel("12:30 PM", now)).toBe("04:30");
  });

  it("rolls countdown to the next day when a prayer time already passed", () => {
    const now = new Date(2026, 2, 24, 23, 30, 0);
    expect(getCountdownLabel("04:52 AM", now)).toBe("05:22");
  });

  it("summarizes completed prayers", () => {
    expect(getPrayerCompletionSummary(mockPrayerTimes)).toBe(
      "1 of 6 prayers checked today",
    );
  });
});
