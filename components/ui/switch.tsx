import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer border-border bg-muted data-[state=checked]:bg-foreground inline-flex h-7 w-12 items-center rounded-full border p-0.5 transition-colors",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="bg-background block h-5 w-5 rounded-full transition-transform data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}
