import { redirect } from "next/navigation";
import { DesktopSignUpScreen } from "@/features/auth/components/desktop-sign-up-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";

export const dynamic = "force-dynamic";

export default async function DesktopSignUpPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (sessionUser) {
    redirect("/desktop/overview");
  }

  return <DesktopSignUpScreen />;
}
