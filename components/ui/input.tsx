import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/35 flex h-12 w-full rounded-[18px] border px-4 text-sm outline-none focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}
