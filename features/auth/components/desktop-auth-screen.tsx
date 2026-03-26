"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthSession } from "@/hooks/use-auth-session";
import { postSignIn } from "@/lib/client/api";
import { mockDevices } from "@/lib/mock-data";

const desktopAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type DesktopAuthValues = z.infer<typeof desktopAuthSchema>;

export function DesktopAuthScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { authError, sessionUser, setSessionUser, signOut, signingOut } =
    useAuthSession();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<DesktopAuthValues>({
    resolver: zodResolver(desktopAuthSchema),
    defaultValues: {
      email: "you@example.com",
      password: "",
    },
  });

  return (
    <DesktopShell
      title="Emarat account"
      subtitle="Sync reminders across phone, watch, and desktop"
    >
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[24px] bg-[linear-gradient(180deg,#0B1220_0%,#172036_100%)] p-7 text-white">
          <div className="space-y-4">
            <p className="font-display text-sm tracking-[0.2em] text-white/60 uppercase">
              Account benefits
            </p>
            <h2 className="font-display text-[1.9rem] font-semibold tracking-[-0.04em]">
              Bilingual reminders, family sync, and desktop prayer windows stay
              connected.
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            <Benefit
              icon={ShieldCheck}
              label="Secure sign-in with device continuity."
            />
            <Benefit
              icon={Users}
              label="Share arrival windows with family members."
            />
            <Benefit
              icon={Sparkles}
              label="Use desktop-specific reminder intensity."
            />
          </div>
        </div>
        <div className="border-border bg-card rounded-[24px] border p-7">
          <div className="space-y-2">
            <h2 className="font-display text-[1.8rem] font-semibold tracking-[-0.03em]">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to keep prayer reminders consistent on every device.
            </p>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                const result = await postSignIn(values);
                setSessionUser(result.user);
                setError(null);
                router.replace("/desktop/overview");
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "Failed to sign in",
                );
              }
            })}
          >
            <DesktopField
              error={errors.email?.message}
              label="Email"
              input={<Input autoComplete="email" {...register("email")} />}
            />
            <DesktopField
              error={errors.password?.message}
              label="Password"
              input={
                <Input
                  autoComplete="current-password"
                  type="password"
                  {...register("password")}
                />
              }
            />
            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Syncing..." : "Sign In"}
            </Button>
          </form>
          {error ? (
            <div className="mt-4 rounded-[18px] bg-[color:var(--color-error)] px-4 py-3 text-sm text-[color:var(--color-error-foreground)]">
              {error}
            </div>
          ) : null}
          {authError ? (
            <div className="mt-4 rounded-[18px] bg-[color:var(--color-error)] px-4 py-3 text-sm text-[color:var(--color-error-foreground)]">
              {authError}
            </div>
          ) : null}
          {sessionUser ? (
            <div className="mt-4 flex items-center gap-2 rounded-[18px] bg-[color:var(--color-success)] px-4 py-3 text-sm text-[color:var(--color-success-foreground)]">
              <CheckCircle2 className="h-4 w-4" />
              Signed in as {sessionUser.name}. Desktop sync is ready.
            </div>
          ) : null}
          {sessionUser ? (
            <Button
              className="mt-4"
              type="button"
              variant="outline"
              onClick={() => void signOut()}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          ) : null}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {mockDevices.map((device) => (
              <div key={device.id} className="bg-secondary rounded-[18px] px-4 py-3">
                <div className="font-medium">{device.name}</div>
                <div className="text-muted-foreground text-sm">
                  {device.lastActive}
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-5 text-sm">
            Need an account?{" "}
            <Link className="text-foreground font-medium" href="/desktop/sign-up">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </DesktopShell>
  );
}

function Benefit({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-white/6 px-4 py-3 text-sm text-white/78">
      <Icon className="text-primary h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

function DesktopField({
  error,
  input,
  label,
}: {
  error?: string | undefined;
  input: ReactNode;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {input}
      {error ? (
        <p className="text-sm text-[color:var(--color-error-foreground)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
