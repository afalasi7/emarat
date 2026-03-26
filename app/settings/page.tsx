import { redirect } from "next/navigation";
import { SettingsScreen } from "@/features/settings/components/settings-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/sign-in");
  }

  return <SettingsScreen />;
}
