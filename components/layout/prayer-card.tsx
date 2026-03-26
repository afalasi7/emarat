import type { PrayerStatus } from "@/types/domain";
import { SectionCard } from "@/components/layout/section-card";
import { cn } from "@/lib/utils";

const statusStyles: Record<PrayerStatus, string> = {
  completed: "bg-card text-card-foreground",
  current:
    "border-transparent bg-[linear-gradient(180deg,#1A2340_0%,#0F172A_100%)] text-white",
  upcoming: "bg-card text-card-foreground",
  scheduled: "bg-card text-card-foreground",
  missed:
    "bg-[color:var(--color-error)] text-[color:var(--color-error-foreground)]",
};

interface PrayerCardProps {
  title: string;
  description: string;
  status: PrayerStatus;
  compact?: boolean;
}

export function PrayerCard({
  compact = false,
  description,
  status,
  title,
}: PrayerCardProps) {
  return (
    <SectionCard
      className={cn(
        "border",
        compact ? "gap-2 p-3.5" : "gap-2 p-4",
        statusStyles[status],
        status === "current" ? "shadow-[0_18px_35px_rgb(15_23_42_/_0.25)]" : "",
      )}
    >
      <div className="font-display text-base font-semibold">{title}</div>
      <p
        className={cn(
          "text-sm leading-6",
          status === "current" ? "text-white/78" : "text-muted-foreground",
        )}
      >
        {description}
      </p>
    </SectionCard>
  );
}
