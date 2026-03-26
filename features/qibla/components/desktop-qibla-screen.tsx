import { Compass, LocateFixed, MapPinned } from "lucide-react";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { SectionCard } from "@/components/layout/section-card";
import { mockQiblaData } from "@/lib/mock-data";
import type { QiblaData } from "@/types/domain";

interface DesktopQiblaScreenProps {
  data?: QiblaData;
}

export function DesktopQiblaScreen({
  data = mockQiblaData,
}: DesktopQiblaScreenProps) {
  return (
    <DesktopShell
      title="Qibla Compass"
      subtitle="Desktop guidance for orientation, precision, and prayer readiness"
    >
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard className="border-transparent bg-[linear-gradient(135deg,#DBEAFE_0%,#C7D8F4_55%,#E2E8F0_100%)] dark:bg-[linear-gradient(135deg,#172554_0%,#1E295E_55%,#111827_100%)]">
          <div className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase dark:text-sky-100/72">
            Live heading
          </div>
          <div className="font-display text-[2.4rem] font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            {data.directionLabel}
          </div>
          <p className="max-w-xl text-sm leading-7 text-[color:var(--color-info-foreground)] dark:text-sky-100">
            {data.guidance}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Alignment"
              value={data.alignmentState === "aligned" ? "Aligned" : "Adjusting"}
            />
            <MetricCard label="Precision" value={`${data.precisionMeters}m`} />
            <MetricCard
              label="Distance"
              value={`${data.travelDistanceKm} km`}
            />
          </div>
        </SectionCard>

        <SectionCard className="gap-4">
          <div className="font-display text-xl font-semibold">
            Orientation cues
          </div>
          <div className="grid gap-3">
            <GuideCard
              description="Show a simple left or right adjustment until the user faces the Qibla."
              icon={Compass}
              title="Turn guidance"
            />
            <GuideCard
              description="When the heading settles, swap to a confident arrival state."
              icon={LocateFixed}
              title="Aligned state"
            />
            <GuideCard
              description={`Context stays anchored to ${data.city} with room for real geolocation later.`}
              icon={MapPinned}
              title="Location context"
            />
          </div>
        </SectionCard>
      </section>
    </DesktopShell>
  );
}

function GuideCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof Compass;
  title: string;
}) {
  return (
    <div className="border-border bg-card flex items-start gap-4 rounded-[20px] border px-4 py-4">
      <div className="bg-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-base font-semibold">{title}</div>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white/72 px-4 py-3 dark:bg-white/6">
      <div className="text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase dark:text-sky-100/68">
        {label}
      </div>
      <div className="font-display mt-2 text-lg font-semibold text-slate-950 dark:text-white">
        {value}
      </div>
    </div>
  );
}
