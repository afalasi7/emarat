import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, MoonStar, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  preview: "mobile" | "desktop";
}

export function LandingPage({ preview }: LandingPageProps) {
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
              {desktop ? "Desktop preview" : "Mobile preview"}
            </div>
            <div className="space-y-4">
              <div className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
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
                Start with a clean account flow, then step into synced prayer
                times, route-aware reminders, and a desktop glance view that no
                longer dumps you directly into the app.
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
                description="Soft reminders, dark-mode parity, and calmer nighttime pacing."
              />
              <FeatureCard
                icon={Compass}
                title="Qibla with context"
                description="Heading cues, precision data, and clearer orientation states."
              />
              <FeatureCard
                icon={Smartphone}
                title="One account, many surfaces"
                description="Phone, watch, and desktop stay in sync once you authenticate."
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] border border-transparent bg-[linear-gradient(160deg,#0B1220_0%,#18253A_55%,#2C4361_100%)] p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs tracking-[0.18em] text-white/64 uppercase">
                    {desktop ? "Desktop preview" : "Mobile preview"}
                  </div>
                  <div className="font-display mt-2 text-[1.65rem] font-semibold tracking-[-0.04em]">
                    {desktop ? "Overview workspace" : "Prayer snapshot"}
                  </div>
                </div>
                <div className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-white">
                  {desktop ? "Desktop active" : "Mobile active"}
                </div>
              </div>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/74">
                The active preview state is now explicit, readable, and separate
                from the theme toggle.
              </p>
              <div
                className={cn(
                  "mt-5 grid gap-3",
                  desktop ? "md:grid-cols-2" : "grid-cols-1",
                )}
              >
                <PreviewPanel
                  eyebrow="Next prayer"
                  title="Asr in 01:12"
                  description="Travel-aware reminders and quiet-hour routing are ready."
                />
                <PreviewPanel
                  eyebrow="Auth flow"
                  title="Landing first"
                  description="Users now arrive on a dedicated landing page and choose sign in or sign up."
                />
              </div>
            </div>
            <div className="rounded-[24px] border border-border bg-card/92 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <div className="font-display text-lg font-semibold">
                    Backend-ready entry flow
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    Session-backed sign-in, sign-up, protected synced routes,
                    and clear landing-page routing are all in place.
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
      <Icon className="text-primary h-5 w-5" />
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
    <div className="rounded-[22px] border border-white/12 bg-white/8 p-4">
      <div className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
        {eyebrow}
      </div>
      <div className="font-display mt-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/72">{description}</p>
    </div>
  );
}
