import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, MoonStar, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  preview: "mobile" | "desktop";
  nextPrayerLabel?: string;
}

export function LandingPage({
  preview,
  nextPrayerLabel = "Live prayer updates",
}: LandingPageProps) {
  const desktop = preview === "desktop";

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div
        className={cn(
          "surface-frame border-border mx-auto overflow-hidden border",
          desktop
            ? "max-w-6xl rounded-[34px] p-7 lg:p-8"
            : "max-w-sm rounded-[28px] p-5",
        )}
      >
        <div className={cn("grid gap-6", desktop && "lg:grid-cols-[1.15fr_0.85fr]")}>
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-border bg-secondary/70 px-4 py-2 text-sm font-medium">
              {desktop ? "Desktop experience" : "Mobile experience"}
            </div>
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-[0.22em] uppercase">
                Emarat prayer companion
              </div>
              <h1
                className={cn(
                  "font-display font-semibold tracking-[-0.05em]",
                  desktop ? "max-w-3xl text-[3.7rem]" : "text-[2.5rem]",
                )}
              >
                Prayer rhythm, Qibla guidance, and calm reminders that feel made
                for daily life.
              </h1>
              <p
                className={cn(
                  "text-muted-foreground max-w-2xl leading-7",
                  desktop ? "text-base" : "text-sm",
                )}
              >
                Begin on a clear landing page, sign in or sign up, then enter a
                focused prayer experience built for daily use.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={desktop ? "/desktop/sign-up" : "/sign-up"}>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={desktop ? "/desktop/sign-in" : "/sign-in"}>
                  Sign in
                </Link>
              </Button>
            </div>
            <div
              className={cn(
                "grid gap-3",
                desktop ? "sm:grid-cols-3" : "grid-cols-1",
              )}
            >
              <FeatureCard
                icon={MoonStar}
                title="Quiet by default"
                description="Soft reminders and calm nighttime pacing."
              />
              <FeatureCard
                icon={Compass}
                title="Qibla with context"
                description="Simple left and right guidance with precision states."
              />
              <FeatureCard
                icon={Smartphone}
                title="Clear on every screen"
                description="Mobile and desktop keep the same structure and hierarchy."
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-foreground text-background rounded-[28px] border border-transparent p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs tracking-[0.18em] text-white/70 uppercase">
                    {desktop ? "Desktop layout" : "Mobile layout"}
                  </div>
                  <div className="font-display mt-2 text-[1.65rem] font-semibold tracking-[-0.04em]">
                    {desktop ? "Overview workspace" : "Prayer snapshot"}
                  </div>
                </div>
                <div className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-white">
                  {desktop ? "Desktop" : "Mobile"}
                </div>
              </div>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/76">
                The active layout label is fixed and always visible.
              </p>
              <div
                className={cn(
                  "mt-5 grid gap-3",
                  desktop ? "md:grid-cols-2" : "grid-cols-1",
                )}
              >
                <PreviewPanel
                  eyebrow="Next prayer"
                  title={nextPrayerLabel}
                  description="Quiet reminders stay simple and consistent."
                />
                <PreviewPanel
                  eyebrow="Entry flow"
                  title="Landing first"
                  description="Every user starts on landing, then chooses sign in or sign up."
                />
              </div>
            </div>
            <div className="rounded-[24px] border border-border bg-card/92 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5" />
                <div>
                  <div className="font-display text-lg font-semibold">
                    Production-ready baseline
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    Session-backed sign-in, protected routes, and clean landing
                    routing are already wired.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof MoonStar;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-border bg-card/88 p-4">
      <Icon className="h-5 w-5" />
      <div className="font-display mt-4 text-base font-semibold">{title}</div>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        {description}
      </p>
    </div>
  );
}

function PreviewPanel({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/18 bg-white/7 p-4">
      <div className="text-xs font-semibold tracking-[0.16em] text-white/68 uppercase">
        {eyebrow}
      </div>
      <div className="font-display mt-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/74">{description}</p>
    </div>
  );
}
