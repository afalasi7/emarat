import type { ComponentPropsWithoutRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCard({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Card>) {
  return (
    <Card
      className={cn("flex flex-col gap-4 p-4 sm:p-5", className)}
      {...props}
    />
  );
}
