"use client";

import { BellRing, Lock, MapPinned, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/layout/section-card";
import { ThemePreferenceControl } from "@/components/layout/theme-preference-control";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useSettingsBackend } from "@/hooks/use-settings-backend";

export function SettingsScreen() {
  const router = useRouter();
  const {
    error,
    reminders,
    selectedReminderId,
    setSelectedReminder,
    settings,
    syncReminderEnabled,
    syncReminderOffset,
    syncSetting,
  } = useSettingsBackend();
  const { authError, sessionUser, signOut, signingOut } = useAuthSession();

  return (
    <AppShell title="Settings" meta="Account">
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
      <SectionCard className="gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-base font-semibold">Account</div>
            <p className="text-muted-foreground mt-1 text-sm">
              {sessionUser
                ? `${sessionUser.name} · ${sessionUser.email}`
                : "Not signed in yet. Local preferences still load on this device."}
            </p>
          </div>
          {sessionUser ? (
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await signOut();
                router.replace("/sign-in");
              }}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          ) : null}
        </div>
      </SectionCard>
      <SectionCard className="bg-secondary gap-2">
        <div className="flex items-center gap-3">
          <BellRing className="h-5 w-5" />
          <div className="font-display text-base font-semibold">Reminders</div>
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          Soft adhan, vibration backup, and prayer streak summary.
        </p>
      </SectionCard>

      <SectionCard className="gap-2 border-transparent bg-[linear-gradient(180deg,#111111_0%,#252525_100%)] text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" />
          <div className="font-display text-base font-semibold">Premium</div>
        </div>
        <p className="text-sm leading-6 text-white/72">
          Unlock travel prayer packs and advanced reminder controls.
        </p>
      </SectionCard>

      <SectionCard className="gap-4">
        <div className="flex items-center gap-3">
          <MapPinned className="h-5 w-5" />
          <div>
            <div className="font-display text-base font-semibold">Location</div>
            <p className="text-muted-foreground text-sm">
              Dubai Marina · {settings.madhab} method
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <PreferenceRow
            checked={settings.quietMode}
            description="Quiet hours stay active during late-night reminders."
            label="Quiet mode"
            onCheckedChange={(checked) => void syncSetting("quietMode", checked)}
          />
          <PreferenceRow
            checked={settings.travelMode}
            description="Travel-aware windows adjust reminder lead time."
            label="Travel mode"
            onCheckedChange={(checked) => void syncSetting("travelMode", checked)}
          />
        </div>
      </SectionCard>

      <SectionCard className="gap-3">
        <div>
          <div className="font-display text-base font-semibold">
            Reminder routing
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage which reminder is active and how early it should land.
          </p>
        </div>
        <div className="space-y-2">
          {reminders.map((reminder) => {
            const active = reminder.id === selectedReminderId;

            return (
              <div
                key={reminder.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedReminder(reminder.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedReminder(reminder.id);
                  }
                }}
                className={`w-full rounded-[18px] border px-4 py-3 text-left transition ${
                  active
                    ? "border-transparent bg-foreground text-background"
                    : "border-border bg-card text-card-foreground"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-base font-semibold">
                      {reminder.label}
                    </div>
                    <div
                      className={`mt-1 text-sm ${
                        active ? "text-background/72" : "text-muted-foreground"
                      }`}
                    >
                      {reminder.prayerName} · {reminder.mode} · {reminder.offsetMinutes} min
                    </div>
                  </div>
                  <Switch
                    checked={reminder.enabled}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={(checked) =>
                      void syncReminderEnabled(reminder.id, checked)
                    }
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={active ? "secondary" : "ghost"}
                    onClick={(event) => {
                      event.stopPropagation();
                      void syncReminderOffset(reminder.id, -5);
                    }}
                  >
                    -5 min
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={active ? "secondary" : "ghost"}
                    onClick={(event) => {
                      event.stopPropagation();
                      void syncReminderOffset(reminder.id, 5);
                    }}
                  >
                    +5 min
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard className="gap-3">
        <div>
          <div className="font-display text-base font-semibold">
            Theme preference
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Choose how Emarat should appear across mobile and desktop.
          </p>
        </div>
        <ThemePreferenceControl
          value={settings.themePreference}
          onChange={(value) => void syncSetting("themePreference", value)}
        />
      </SectionCard>

      <SectionCard className="bg-secondary gap-3">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5" />
          <div className="font-display text-base font-semibold">Privacy</div>
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          Face ID unlock and local-only history are enabled.
        </p>
      </SectionCard>
    </AppShell>
  );
}

interface PreferenceRowProps {
  checked: boolean;
  description: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceRow({
  checked,
  description,
  label,
  onCheckedChange,
}: PreferenceRowProps) {
  return (
    <div className="bg-card flex items-start justify-between gap-4 rounded-[18px] px-4 py-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
