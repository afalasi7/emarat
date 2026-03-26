"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "border-border bg-card text-muted-foreground hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
        className,
      )}
    >
      {isDark ? (
        <SunMedium className="text-primary h-4 w-4" />
      ) : (
        <MoonStar className="h-4 w-4" />
      )}
    </button>
  );
}
