"use client";

import { LaptopMinimal, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { UserSettings } from "@/types/domain";

const options = [
  { value: "system", label: "System", icon: LaptopMinimal },
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: MoonStar },
] as const satisfies ReadonlyArray<{
  value: UserSettings["themePreference"];
  label: string;
  icon: typeof LaptopMinimal;
}>;

interface ThemePreferenceControlProps {
  value: UserSettings["themePreference"];
  onChange: (value: UserSettings["themePreference"]) => void;
}

export function ThemePreferenceControl({
  onChange,
  value,
}: ThemePreferenceControlProps) {
  const mounted = useMounted();
  const { setTheme } = useTheme();

  return (
    <div className="rounded-[18px] bg-secondary p-1">
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => {
          const Icon = option.icon;
          const active = mounted && option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setTheme(option.value);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-[14px] px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-card text-foreground shadow-[0_6px_18px_rgb(17_17_17_/_0.08)] dark:shadow-[0_8px_18px_rgb(0_0_0_/_0.22)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={active}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
