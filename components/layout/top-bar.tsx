import { ModeToggle } from "@/components/layout/mode-toggle";

interface TopBarProps {
  title: string;
  meta?: string | undefined;
  subtitle?: string | undefined;
  viewLabel?: string | undefined;
  showModeToggle?: boolean;
}

export function TopBar({
  title,
  meta,
  subtitle,
  viewLabel,
  showModeToggle = true,
}: TopBarProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[1.65rem] font-semibold tracking-[-0.03em]">
            {title}
          </h1>
          {meta ? (
            <span className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
              {meta}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {viewLabel ? (
          <span className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
            {viewLabel}
          </span>
        ) : null}
        {showModeToggle ? <ModeToggle /> : null}
      </div>
    </div>
  );
}
