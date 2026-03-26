import type { ReactNode } from "react";
import { SectionCard } from "@/components/layout/section-card";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthFormCard({
  children,
  description,
  title,
}: AuthFormCardProps) {
  return (
    <SectionCard className="border-border/90 bg-card/95 gap-5 rounded-[24px] border p-5">
      <div className="space-y-2">
        <h2 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em]">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-sm text-sm leading-6">
          {description}
        </p>
      </div>
      {children}
    </SectionCard>
  );
}
