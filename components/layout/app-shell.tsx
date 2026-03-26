"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { mobileNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { shellShadow } from "@/styles/tokens";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: ReactNode;
  title: string;
  meta?: string;
  subtitle?: string;
  showNav?: boolean;
}

export function AppShell({
  children,
  meta,
  showNav = true,
  subtitle,
  title,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-sm">
        <div
          className={cn(
            "surface-frame border-border relative overflow-hidden rounded-[28px] border px-5 py-6",
            shellShadow,
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgb(255_255_255_/_0.18)_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgb(255_255_255_/_0.03)_100%)]" />
          <div className="relative flex min-h-[640px] flex-col gap-5">
            <TopBar title={title} meta={meta} subtitle={subtitle} />
            <div className="flex flex-1 flex-col gap-4">{children}</div>
            {showNav ? (
              <nav className="border-border/90 bg-card/85 grid grid-cols-4 gap-2 rounded-[22px] border p-2 backdrop-blur">
                {mobileNavItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-[16px] px-3 py-2 text-center text-xs font-medium transition",
                        active
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
