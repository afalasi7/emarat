import { redirect } from "next/navigation";
import { QiblaScreen } from "@/features/qibla/components/qibla-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";
import { getQiblaData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function QiblaPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/sign-in");
  }

  const qibla = await getQiblaData();
  return <QiblaScreen data={qibla} />;
}
