import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  info: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  neutral: "bg-secondary text-secondary-foreground",
} as const;

interface StatusChipProps {
  label: string;
  icon: LucideIcon;
  tone?: keyof typeof toneStyles;
}

export function StatusChip({
  icon: Icon,
  label,
  tone = "neutral",
}: StatusChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
        toneStyles[tone],
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
