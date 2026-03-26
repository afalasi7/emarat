import { ModeToggle } from "@/components/layout/mode-toggle";

interface TopBarProps {
  title: string;
  meta?: string | undefined;
  subtitle?: string | undefined;
}

export function TopBar({ title, meta, subtitle }: TopBarProps) {
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
      <ModeToggle />
    </div>
  );
}
