"use client";

import { Monitor, Smartphone, Watch } from "lucide-react";
import { useEffect } from "react";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { SectionCard } from "@/components/layout/section-card";
import { mockDesktopOverview } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";
import type { DesktopOverviewData, Device } from "@/types/domain";

const deviceIcons = {
  phone: Smartphone,
  watch: Watch,
  desktop: Monitor,
} as const;

interface DesktopOverviewScreenProps {
  devices?: Device[];
  overview?: DesktopOverviewData;
}

export function DesktopOverviewScreen({
  devices: initialDevices,
  overview = mockDesktopOverview,
}: DesktopOverviewScreenProps) {
  const devices = useAppStore((state) => state.devices);
  const activeDeviceId = useAppStore((state) => state.activeDeviceId);
  const hydrateServerState = useAppStore((state) => state.hydrateServerState);
  const setActiveDevice = useAppStore((state) => state.setActiveDevice);

  useEffect(() => {
    if (initialDevices) {
      hydrateServerState({ devices: initialDevices });
    }
  }, [hydrateServerState, initialDevices]);

  return (
    <DesktopShell title="Emarat Dashboard" subtitle="Prayer reminder desktop">
      <section className="grid gap-5 lg:grid-cols-2">
        <SectionCard className="border-transparent bg-[linear-gradient(135deg,#0B0B0C_0%,#1B2432_68%,#5F7D95_100%)] text-white">
          <div className="font-display text-[2rem] font-semibold tracking-[-0.04em]">
            {overview.heroLeft.title}
          </div>
          <p className="max-w-md text-sm text-white/75">
            {overview.heroLeft.description}
          </p>
        </SectionCard>
        <SectionCard className="bg-card">
          <div className="font-display text-[1.7rem] font-semibold tracking-[-0.03em]">
            {overview.heroRight.title}
          </div>
          <p className="text-muted-foreground max-w-md text-sm">
            {overview.heroRight.description}
          </p>
        </SectionCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <SectionCard className="gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {overview.insight.title}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-6">
              {overview.insight.description}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {overview.insight.points.map((point) => (
              <div
                key={point}
                className="bg-secondary text-foreground rounded-[18px] px-4 py-3 text-sm"
              >
                {point}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard className="gap-4">
          <h2 className="font-display text-xl font-semibold">Synced devices</h2>
          <div className="grid gap-3">
            {devices.map((device) => {
              const Icon = deviceIcons[device.kind];
              const active = device.id === activeDeviceId;

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => setActiveDevice(device.id)}
                  className={`flex items-center justify-between rounded-[18px] border px-4 py-3 text-left transition ${
                    active
                      ? "bg-foreground text-background border-transparent"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div
                        className={`text-xs ${
                          active
                            ? "text-background/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {device.lastActive}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold">
                    {device.synced ? "Synced" : "Pending"}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </section>
    </DesktopShell>
  );
}
