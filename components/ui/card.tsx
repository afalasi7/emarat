import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "surface-card border-border bg-card text-card-foreground rounded-[20px] border",
        className,
      )}
      {...props}
    />
  );
}
