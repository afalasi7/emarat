import { redirect } from "next/navigation";
import { PrayerTimesScreen } from "@/features/prayer-times/components/prayer-times-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";
import { getPrayerTimesData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function PrayerTimesPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/sign-in");
  }

  const { prayerTimes, reminders, settings } = await getPrayerTimesData();
  return (
    <PrayerTimesScreen
      prayerTimes={prayerTimes}
      reminders={reminders}
      settings={settings}
    />
  );
}
