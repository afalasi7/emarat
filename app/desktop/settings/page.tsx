import { redirect } from "next/navigation";
import { DesktopSettingsScreen } from "@/features/settings/components/desktop-settings-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";

export const dynamic = "force-dynamic";

export default async function DesktopSettingsPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/desktop/sign-in");
  }

  return <DesktopSettingsScreen />;
}
