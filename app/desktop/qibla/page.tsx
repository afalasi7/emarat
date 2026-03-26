import { redirect } from "next/navigation";
import { DesktopQiblaScreen } from "@/features/qibla/components/desktop-qibla-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";
import { getQiblaData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function DesktopQiblaPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/desktop/sign-in");
  }

  const qibla = await getQiblaData();
  return <DesktopQiblaScreen data={qibla} />;
}
