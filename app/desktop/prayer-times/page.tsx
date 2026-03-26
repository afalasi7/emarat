import { redirect } from "next/navigation";
import { DesktopPrayerTimesScreen } from "@/features/prayer-times/components/desktop-prayer-times-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";
import { getPrayerTimesData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function DesktopPrayerTimesPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/desktop/sign-in");
  }

  const { prayerTimes } = await getPrayerTimesData();
  return <DesktopPrayerTimesScreen prayerTimes={prayerTimes} />;
}
