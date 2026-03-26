import { Compass, LocateFixed } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/layout/section-card";
import { mockQiblaData } from "@/lib/mock-data";
import type { QiblaData } from "@/types/domain";

interface QiblaScreenProps {
  data?: QiblaData;
}

export function QiblaScreen({ data = mockQiblaData }: QiblaScreenProps) {
  return (
    <AppShell title="Qibla" meta="Live">
      <SectionCard className="border-transparent bg-[linear-gradient(180deg,#eeeeee_0%,#e2e2e2_100%)] dark:bg-[linear-gradient(180deg,#212121_0%,#171717_100%)]">
        <div className="font-display text-[2.2rem] leading-none font-semibold tracking-[-0.04em]">
          {data.directionLabel}
        </div>
        <p className="text-muted-foreground max-w-[22rem] text-sm leading-7 dark:text-white/75">
          {data.guidance}
        </p>
      </SectionCard>

      <SectionCard className="bg-secondary/70 gap-3">
        <SectionCard className="bg-card/75 gap-2">
          <div className="font-display text-lg font-semibold">
            Friendly guide
          </div>
          <p className="text-muted-foreground text-sm leading-7">
            It should simply say turn right or turn left, then tell you how much
            to turn inside until you face the Qibla.
          </p>
        </SectionCard>
        <SectionCard className="bg-card/85 flex-row items-center gap-4">
          <div className="bg-background flex h-13 w-13 items-center justify-center rounded-[14px] border">
            <Compass className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="font-display text-lg font-semibold">
              Reached Qibla
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              When you finally line up, show the Kaaba. If you are at the Kaaba,
              show the Kaaba immediately.
            </p>
          </div>
        </SectionCard>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <SectionCard className="gap-1">
          <div className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
            Turn inside
          </div>
          <div className="font-display text-[1.75rem] font-semibold">
            {data.degrees}° right
          </div>
        </SectionCard>
        <SectionCard className="gap-1">
          <div className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
            When aligned
          </div>
          <div className="font-display text-[1.4rem] font-semibold">
            Show Kaaba
          </div>
        </SectionCard>
      </div>

      <SectionCard className="bg-secondary flex-row items-center gap-3 border-transparent">
        <LocateFixed className="h-5 w-5" />
        <p className="text-muted-foreground text-sm">
          Precision {data.precisionMeters}m · Distance {data.travelDistanceKm}
          km
        </p>
      </SectionCard>
    </AppShell>
  );
}
