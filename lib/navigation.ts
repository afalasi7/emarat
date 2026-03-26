import type { Route } from "next";

export const mobileNavItems = [
  { href: "/overview", label: "Overview" },
  { href: "/prayer-times", label: "Prayer Times" },
  { href: "/qibla", label: "Qibla" },
  { href: "/settings", label: "Settings" },
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export const desktopNavItems = [
  { href: "/desktop/overview", label: "Overview" },
  { href: "/desktop/prayer-times", label: "Prayer Times" },
  { href: "/desktop/qibla", label: "Qibla" },
  { href: "/desktop/settings", label: "Settings" },
  { href: "/desktop/sign-in", label: "Sign In" },
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;
