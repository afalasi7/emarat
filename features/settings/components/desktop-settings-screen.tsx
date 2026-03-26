"use client";

import { useRouter } from "next/navigation";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { SectionCard } from "@/components/layout/section-card";
import { ThemePreferenceControl } from "@/components/layout/theme-preference-control";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useSettingsBackend } from "@/hooks/use-settings-backend";

export function DesktopSettingsScreen() {
  const router = useRouter();
  const { error, settings, syncSetting } = useSettingsBackend();
  const { authError, sessionUser, signOut, signingOut } = useAuthSession();

  return (
    <DesktopShell
      title="Family & Settings"
      subtitle="Preferences, privacy, and reminder behavior"
    >
      {error ? (
        <SectionCard className="border-transparent bg-[color:var(--color-error)] text-[color:var(--color-error-foreground)]">
          <div className="font-medium">{error}</div>
        </SectionCard>
      ) : null}
      {authError ? (
        <SectionCard className="border-transparent bg-[color:var(--color-error)] text-[color:var(--color-error-foreground)]">
          <div className="font-medium">{authError}</div>
        </SectionCard>
      ) : null}
      <SectionCard className="gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-semibold">Account</div>
            <p className="text-muted-foreground mt-1 text-sm">
              {sessionUser
                ? `${sessionUser.name} · ${sessionUser.email}`
                : "No active session. Desktop settings still render locally."}
            </p>
          </div>
          {sessionUser ? (
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await signOut();
                router.replace("/desktop/sign-in");
              }}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          ) : null}
        </div>
      </SectionCard>
      <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <SectionCard className="gap-4">
          <div className="font-display text-xl font-semibold">Preferences</div>
          <div className="space-y-3">
            <SettingStat label="School" value={settings.madhab} />
            <SettingStat label="Method" value={settings.calculationMethod} />
            <SettingStat label="Language" value={settings.language} />
          </div>
        </SectionCard>
        <SectionCard className="gap-4">
          <div className="font-display text-xl font-semibold">
            Reminder posture
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <SettingCard
              description="Quiet hours remain on for Isha and Fajr handoff."
              title="Quiet mode"
              value={settings.quietMode ? "Enabled" : "Disabled"}
            />
            <SettingCard
              description="Travel route awareness adjusts desktop lead time."
              title="Travel mode"
              value={settings.travelMode ? "Enabled" : "Disabled"}
            />
            <SettingCard
              description="Theme stays consistent with the app shell and mode toggle."
              title="Theme"
              value={settings.themePreference}
            />
            <SettingCard
              description="Reminder lead time before key desktop prayer prompts."
              title="Lead time"
              value={`${settings.notificationWindowMinutes} min`}
            />
          </div>
        </SectionCard>
      </section>
      <SectionCard className="gap-4">
        <div>
          <div className="font-display text-xl font-semibold">
            Theme preference
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Apply your theme selection across the current experience.
          </p>
        </div>
        <ThemePreferenceControl
          value={settings.themePreference}
          onChange={(value) => void syncSetting("themePreference", value)}
        />
      </SectionCard>
    </DesktopShell>
  );
}

function SettingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-[18px] px-4 py-3">
      <div className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
        {label}
      </div>
      <div className="font-display mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function SettingCard({
  description,
  title,
  value,
}: {
  description: string;
  title: string;
  value: string;
}) {
  return (
    <div className="border-border bg-card rounded-[20px] border px-4 py-4">
      <div className="font-display text-base font-semibold">{title}</div>
      <div className="text-muted-foreground mt-1 text-sm">{description}</div>
      <div className="text-foreground mt-4 text-sm font-semibold">{value}</div>
    </div>
  );
}
