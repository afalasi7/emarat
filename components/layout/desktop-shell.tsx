"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { desktopNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { shellShadow } from "@/styles/tokens";
import { ModeToggle } from "./mode-toggle";

interface DesktopShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showNav?: boolean;
  showModeToggle?: boolean;
}

export function DesktopShell({
  children,
  showModeToggle = true,
  showNav = true,
  subtitle,
  title,
}: DesktopShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={cn(
          "surface-frame border-border mx-auto max-w-6xl overflow-hidden rounded-[32px] border p-7",
          shellShadow,
        )}
      >
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="font-display text-[1.85rem] font-semibold tracking-[-0.03em]">
                {title}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {showNav ? (
                <>
                  <span className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
                    Desktop view
                  </span>
                  <nav className="flex flex-wrap items-center gap-2">
                    {desktopNavItems.map((item) => {
                      const active = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition",
                            active
                              ? "bg-foreground text-background"
                              : "bg-card text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </>
              ) : null}
              {showModeToggle ? <ModeToggle /> : null}
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
