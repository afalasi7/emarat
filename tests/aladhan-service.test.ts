import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLivePrayerSnapshot,
  getNextPrayerLabel,
  mapAladhanPrayerTimes,
} from "@/lib/server/aladhan";
import { mockPrayerTimes } from "@/lib/mock-data";

const prayerPayload = {
  code: 200,
  status: "OK",
  data: {
    timings: {
      Fajr: "04:52 (+04)",
      Sunrise: "06:18 (+04)",
      Dhuhr: "12:21 (+04)",
      Asr: "15:33 (+04)",
      Maghrib: "18:41 (+04)",
      Isha: "20:03 (+04)",
    },
    date: {
      readable: "24 Mar 2026",
      hijri: {
        date: "12-09-1447",
        day: "12",
        month: {
          en: "Ramadan",
        },
        year: "1447",
      },
    },
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("aladhan adapter", () => {
  it("maps timings to prayer cards while preserving local completion state", () => {
    const now = new Date("2026-03-24T09:00:00.000Z");
    const prayerTimes = mapAladhanPrayerTimes(
      prayerPayload.data.timings,
      now,
      mockPrayerTimes,
      "Asia/Dubai",
    );

    expect(prayerTimes[0]?.adhanTime).toBe("04:52 AM");
    expect(prayerTimes[0]?.status).toBe("completed");
    expect(prayerTimes[3]?.status).toBe("current");
    expect(prayerTimes[3]?.note).toContain("Upcoming in");
  });

  it("returns a typed live snapshot when Aladhan responds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(prayerPayload), { status: 200 }),
      ),
    );

    const live = await getLivePrayerSnapshot({
      city: "Dubai",
      country: "UAE",
      method: 2,
      fallbackPrayerTimes: mockPrayerTimes,
    });

    expect(live?.city).toBe("Dubai");
    expect(live?.hijriLabel).toBe("12 Ramadan");
    expect(live?.prayerTimes).toHaveLength(6);
  });

  it("returns null when Aladhan request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network unavailable")),
    );

    const live = await getLivePrayerSnapshot({
      city: "Dubai",
      country: "UAE",
      method: 2,
    });

    expect(live).toBeNull();
  });

  it("computes next prayer using prayer-location timezone", () => {
    const now = new Date("2026-03-24T11:50:00.000Z");
    const prayerTimes = mapAladhanPrayerTimes(
      prayerPayload.data.timings,
      now,
      mockPrayerTimes,
      "Asia/Dubai",
    );

    const label = getNextPrayerLabel(prayerTimes, now, "Asia/Dubai");

    expect(label.startsWith("Maghrib in")).toBe(true);
    expect(label.startsWith("Dhuhr in")).toBe(false);
  });
});
