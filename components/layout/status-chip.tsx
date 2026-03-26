import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  info: "bg-secondary text-foreground",
  success: "bg-muted text-foreground",
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
