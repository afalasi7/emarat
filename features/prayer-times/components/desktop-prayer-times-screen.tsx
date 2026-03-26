import { DesktopShell } from "@/components/layout/desktop-shell";
import { PrayerCard } from "@/components/layout/prayer-card";
import { SectionCard } from "@/components/layout/section-card";
import { mockPrayerTimes } from "@/lib/mock-data";
import type { PrayerTime } from "@/types/domain";

interface DesktopPrayerTimesScreenProps {
  prayerTimes?: PrayerTime[];
}

export function DesktopPrayerTimesScreen({
  prayerTimes = mockPrayerTimes,
}: DesktopPrayerTimesScreenProps) {
  return (
    <DesktopShell
      title="Prayer Times"
      subtitle="Desktop prayer pacing and reminder routing"
    >
      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard className="gap-4">
          <div className="font-display text-xl font-semibold">
            Today&apos;s prayer flow
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {prayerTimes
              .filter((prayer) => prayer.name !== "Sunrise")
              .map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  compact
                  title={`${prayer.name} · ${prayer.adhanTime}`}
                  description={prayer.note}
                  status={prayer.status}
                />
              ))}
          </div>
        </SectionCard>
        <SectionCard className="gap-4">
          <div className="font-display text-xl font-semibold">
            Readiness board
          </div>
          <p className="text-muted-foreground text-sm">
            Quiet hours and commute buffer stay aligned for the next prayer.
          </p>
          <div className="bg-secondary text-foreground rounded-[18px] px-4 py-3 text-sm">
            Current cadence: on-time window with soft chime fallback.
          </div>
          <div className="bg-card text-muted-foreground rounded-[18px] px-4 py-3 text-sm">
            Upcoming handoff: move reminder priority to the desktop 18 minutes
            before Asr.
          </div>
        </SectionCard>
      </section>
    </DesktopShell>
  );
}
