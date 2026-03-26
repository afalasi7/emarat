"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppShell } from "@/components/layout/app-shell";
import { AuthFormCard } from "@/components/layout/auth-form-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthSession } from "@/hooks/use-auth-session";
import { postSignIn } from "@/lib/client/api";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { authError, sessionUser, setSessionUser, signOut, signingOut } =
    useAuthSession();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "you@example.com",
      password: "",
    },
  });

  return (
    <AppShell
      title="Welcome back"
      subtitle="Sign in to access your prayer dashboard."
      showNav={false}
      showModeToggle={false}
    >
      <AuthFormCard
        title="Sign In"
        description="Continue with your account to keep reminders and preferences available."
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              const result = await postSignIn(values);
              setSessionUser(result.user);
              setError(null);
              router.replace("/overview");
            } catch (requestError) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Failed to sign in",
              );
            }
          })}
        >
          <Field
            error={errors.email?.message}
            htmlFor="email"
            label="Email"
            render={
              <Input
                autoComplete="email"
                id="email"
                placeholder="you@example.com"
                {...register("email")}
              />
            }
          />
          <Field
            error={errors.password?.message}
            htmlFor="password"
            label="Password"
            render={
              <Input
                autoComplete="current-password"
                id="password"
                placeholder="Password"
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
            {isSubmitting ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        {error ? (
          <div className="flex items-center gap-2 rounded-[18px] bg-[color:var(--color-error)] px-4 py-3 text-sm text-[color:var(--color-error-foreground)]">
            {error}
          </div>
        ) : null}
        {authError ? (
          <div className="flex items-center gap-2 rounded-[18px] bg-[color:var(--color-error)] px-4 py-3 text-sm text-[color:var(--color-error-foreground)]">
            {authError}
          </div>
        ) : null}
        {sessionUser ? (
          <div className="flex items-center gap-2 rounded-[18px] bg-[color:var(--color-success)] px-4 py-3 text-sm text-[color:var(--color-success-foreground)]">
            <CheckCircle2 className="h-4 w-4" />
            Signed in as {sessionUser.name}.
          </div>
        ) : null}
        {sessionUser ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => void signOut()}
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </Button>
        ) : null}
        <p className="text-muted-foreground text-sm">
          Need an account?{" "}
          <Link className="text-foreground font-medium" href="/sign-up">
            Sign up
          </Link>
        </p>
      </AuthFormCard>
    </AppShell>
  );
}

function Field({
  error,
  htmlFor,
  label,
  render,
}: {
  error?: string | undefined;
  htmlFor: string;
  label: string;
  render: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {render}
      {error ? (
        <p className="text-sm text-[color:var(--color-error-foreground)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
