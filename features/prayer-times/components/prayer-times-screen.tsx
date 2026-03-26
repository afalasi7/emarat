import { BellOff, MapPinned } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PrayerCard } from "@/components/layout/prayer-card";
import { SectionCard } from "@/components/layout/section-card";
import { StatusChip } from "@/components/layout/status-chip";
import { mockPrayerTimes, mockUserSettings } from "@/lib/mock-data";
import { getPrayerCompletionSummary } from "@/lib/prayer";
import type { PrayerTime, Reminder, UserSettings } from "@/types/domain";

interface PrayerTimesScreenProps {
  prayerTimes?: PrayerTime[];
  reminders?: Reminder[];
  settings?: UserSettings;
}

export function PrayerTimesScreen({
  prayerTimes = mockPrayerTimes,
  reminders = [],
  settings = mockUserSettings,
}: PrayerTimesScreenProps) {
  const heroPrayer = prayerTimes[2];
  const travelReminder = reminders.find(
    (reminder) => reminder.mode === "desktop-banner",
  );

  return (
    <AppShell title="Prayer Times" meta="Dubai" subtitle="Today · Tue, 12 Mar">
      {prayerTimes
        .filter((prayer) => prayer.name !== "Sunrise" && prayer.name !== "Isha")
        .map((prayer) => (
          <PrayerCard
            key={prayer.id}
            title={`${prayer.name} · ${prayer.adhanTime}`}
            description={prayer.note}
            status={prayer.id === heroPrayer?.id ? "current" : prayer.status}
          />
        ))}

      <div className="flex flex-wrap gap-2">
        <StatusChip icon={BellOff} label="Auto mute on" tone="info" />
        <StatusChip
          icon={MapPinned}
          label={settings.travelMode ? "Travel on" : "Travel off"}
          tone="success"
        />
      </div>

      <SectionCard className="border-border bg-secondary">
        <div className="font-display text-sm font-semibold">Prayer window</div>
        <p className="text-muted-foreground text-sm">
          Sunrise {prayerTimes[1]?.adhanTime} · Isha {prayerTimes[5]?.adhanTime} ·{" "}
          {settings.madhab} {travelReminder ? "routing ready" : "routing off"}
        </p>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <SectionCard className="border-transparent bg-secondary">
          <div className="text-muted-foreground font-display text-xs font-semibold tracking-[0.16em] uppercase">
            Streak
          </div>
          <div className="font-display text-lg font-semibold">
            {getPrayerCompletionSummary(prayerTimes)}
          </div>
        </SectionCard>
        <SectionCard className="border-transparent bg-secondary">
          <div className="text-muted-foreground font-display text-xs font-semibold tracking-[0.16em] uppercase">
            Window
          </div>
          <div className="font-display text-lg font-semibold">3h 45m left</div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
