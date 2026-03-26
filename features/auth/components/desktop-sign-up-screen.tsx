"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { postSignUp } from "@/lib/client/api";

const desktopSignUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type DesktopSignUpValues = z.infer<typeof desktopSignUpSchema>;

export function DesktopSignUpScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { authError, setSessionUser } = useAuthSession();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<DesktopSignUpValues>({
    resolver: zodResolver(desktopSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <DesktopShell
      title="Create your Emarat account"
      subtitle="Start from the landing page, then move straight into the synced desktop experience"
    >
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] bg-[linear-gradient(180deg,#10141D_0%,#18253A_100%)] p-7 text-white">
          <div className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
            Account setup
          </div>
          <h2 className="font-display mt-4 text-[2.1rem] font-semibold tracking-[-0.04em]">
            Sign up once, then keep mobile and desktop prayer views in sync.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/74">
            Landing pages now sit in front of the product, so new users start
            with an explicit account choice instead of being dropped directly
            into the dashboard.
          </p>
        </div>
        <div className="border-border bg-card rounded-[28px] border p-7">
          <div className="space-y-2">
            <h2 className="font-display text-[1.8rem] font-semibold tracking-[-0.03em]">
              Sign up
            </h2>
            <p className="text-muted-foreground text-sm">
              Create an account to unlock synced reminders and desktop continuity.
            </p>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                const result = await postSignUp(values);
                setSessionUser(result.user);
                setError(null);
                router.replace("/desktop/overview");
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "Failed to sign up",
                );
              }
            })}
          >
            <DesktopField
              error={errors.name?.message}
              label="Name"
              input={<Input autoComplete="name" {...register("name")} />}
            />
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
                  autoComplete="new-password"
                  type="password"
                  {...register("password")}
                />
              }
            />
            <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
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
          <p className="text-muted-foreground mt-5 text-sm">
            Already have an account?{" "}
            <Link className="text-foreground font-medium" href="/desktop/sign-in">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </DesktopShell>
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
