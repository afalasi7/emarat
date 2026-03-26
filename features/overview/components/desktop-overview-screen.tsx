import { DesktopShell } from "@/components/layout/desktop-shell";
import { SectionCard } from "@/components/layout/section-card";
import { mockDesktopOverview } from "@/lib/mock-data";
import type { DesktopOverviewData } from "@/types/domain";

interface DesktopOverviewScreenProps {
  overview?: DesktopOverviewData;
}

export function DesktopOverviewScreen({
  overview = mockDesktopOverview,
}: DesktopOverviewScreenProps) {
  return (
    <DesktopShell title="Emarat Dashboard" subtitle="Prayer reminder desktop">
      <section className="grid gap-5 lg:grid-cols-2">
        <SectionCard className="border-transparent bg-[linear-gradient(135deg,#121212_0%,#232323_68%,#2f2f2f_100%)] text-white">
          <div className="font-display text-[2rem] font-semibold tracking-[-0.04em]">
            {overview.heroLeft.title}
          </div>
          <p className="max-w-md text-sm text-white/75">
            {overview.heroLeft.description}
          </p>
        </SectionCard>
        <SectionCard className="bg-card">
          <div className="font-display text-[1.7rem] font-semibold tracking-[-0.03em]">
            {overview.heroRight.title}
          </div>
          <p className="text-muted-foreground max-w-md text-sm">
            {overview.heroRight.description}
          </p>
        </SectionCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <SectionCard className="gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {overview.insight.title}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-6">
              {overview.insight.description}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {overview.insight.points.map((point) => (
              <div
                key={point}
                className="bg-secondary text-foreground rounded-[18px] px-4 py-3 text-sm"
              >
                {point}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard className="gap-4">
          <h2 className="font-display text-xl font-semibold">Focus checklist</h2>
          <div className="grid gap-3">
            <div className="border-border bg-card rounded-[18px] border px-4 py-3 text-sm">
              Qibla heading visible before prayer entry.
            </div>
            <div className="border-border bg-card rounded-[18px] border px-4 py-3 text-sm">
              Reminder windows set for Maghrib and Isha.
            </div>
            <div className="border-border bg-card rounded-[18px] border px-4 py-3 text-sm">
              Theme and quiet mode kept consistent with user preference.
            </div>
          </div>
        </SectionCard>
      </section>
    </DesktopShell>
  );
}
