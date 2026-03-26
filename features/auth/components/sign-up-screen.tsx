"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
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
import { postSignUp } from "@/lib/client/api";

const signUpSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { authError, setSessionUser } = useAuthSession();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <AppShell
      title="Create your account"
      subtitle="Start with a clean landing flow, then move into your synced prayer dashboard."
      showNav={false}
    >
      <AuthFormCard
        title="Sign Up"
        description="Create an Emarat account to unlock synced prayer rhythm, Qibla guidance, and device continuity."
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              const result = await postSignUp(values);
              setSessionUser(result.user);
              setError(null);
              router.replace("/overview");
            } catch (requestError) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Failed to sign up",
              );
            }
          })}
        >
          <Field
            error={errors.name?.message}
            htmlFor="name"
            label="Name"
            render={<Input id="name" placeholder="Your name" {...register("name")} />}
          />
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
                autoComplete="new-password"
                id="password"
                placeholder="Create a password"
                type="password"
                {...register("password")}
              />
            }
          />
          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        {error ? <Banner>{error}</Banner> : null}
        {authError ? <Banner>{authError}</Banner> : null}
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link className="text-foreground font-medium" href="/sign-in">
            Sign in
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

function Banner({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-[18px] bg-[color:var(--color-error)] px-4 py-3 text-sm text-[color:var(--color-error-foreground)]">
      {children}
    </div>
  );
}
