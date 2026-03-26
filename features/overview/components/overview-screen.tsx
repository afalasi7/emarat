import { Clock3, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/layout/section-card";
import { mockOverview } from "@/lib/mock-data";
import type { OverviewData } from "@/types/domain";

interface OverviewScreenProps {
  data?: OverviewData;
}

export function OverviewScreen({ data = mockOverview }: OverviewScreenProps) {
  return (
    <AppShell title="Emarat" meta={data.hijriDate}>
      <SectionCard className="border-transparent bg-[linear-gradient(180deg,#111111_0%,#1A2340_100%)] text-white">
        <div className="text-xs font-medium tracking-[0.2em] text-white/65 uppercase">
          Next prayer
        </div>
        <div className="font-display text-[2rem] font-semibold tracking-[-0.04em]">
          {data.nextPrayerLabel}
        </div>
        <p className="text-sm text-white/75">{data.location}</p>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/60">
          <span>Sunset 6:41 PM</span>
          <span>Quiet mode on</span>
        </div>
      </SectionCard>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">
          Today&apos;s rhythm
        </h2>
        <SectionCard className="space-y-2">
          <div className="font-display text-base font-semibold">
            {data.rhythmCards[0]?.title}
          </div>
          <p className="text-muted-foreground text-sm">
            {data.rhythmCards[0]?.description}
          </p>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>{data.rhythmCards[0]?.metaLeft}</span>
            <span className="font-display text-[color:var(--color-info-foreground)]">
              {data.rhythmCards[0]?.metaRight}
            </span>
          </div>
        </SectionCard>
        <SectionCard className="border-transparent bg-[color:var(--color-info)]">
          <div className="font-display text-foreground text-base font-semibold">
            {data.rhythmCards[1]?.title}
          </div>
          <p className="text-sm leading-6 text-[color:var(--color-info-foreground)]">
            {data.rhythmCards[1]?.description}
          </p>
        </SectionCard>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <SectionCard className="gap-1">
          <div className="font-display text-base font-semibold">
            {data.stats[0]?.label}
          </div>
          <p className="text-muted-foreground text-sm">
            {data.stats[0]?.value}
          </p>
        </SectionCard>
        <SectionCard className="gap-1">
          <div className="font-display text-base font-semibold">
            {data.stats[1]?.label}
          </div>
          <p className="text-muted-foreground text-sm">
            {data.stats[1]?.value}
          </p>
        </SectionCard>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-base font-semibold">Upcoming</h2>
        <SectionCard className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3 className="text-primary h-5 w-5" />
            <span className="font-display text-sm font-semibold">
              {data.upcoming.label}
            </span>
          </div>
          <span className="text-sm font-medium text-[color:var(--color-info-foreground)]">
            {data.upcoming.time}
          </span>
        </SectionCard>
      </section>

      <div className="border-border/80 bg-card/75 text-muted-foreground grid grid-cols-3 gap-2 rounded-[22px] border p-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          Ready
        </div>
        <div className="flex items-center gap-2">
          <MoonStar className="h-4 w-4" />
          Quiet
        </div>
        <div className="flex items-center gap-2">
          <SunMedium className="text-primary h-4 w-4" />
          Clear
        </div>
      </div>
    </AppShell>
  );
}
