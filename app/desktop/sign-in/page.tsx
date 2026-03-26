import { redirect } from "next/navigation";
import { DesktopAuthScreen } from "@/features/auth/components/desktop-auth-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";

export const dynamic = "force-dynamic";

export default async function DesktopSignInPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (sessionUser) {
    redirect("/desktop/overview");
  }

  return <DesktopAuthScreen />;
}
