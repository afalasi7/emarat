import { LandingPage } from "@/features/landing/components/landing-page";
import { getNextPrayerLabel } from "@/lib/server/aladhan";
import { getPrayerTimesData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function DesktopLandingPage() {
  const { prayerTimes } = await getPrayerTimesData();
  const nextPrayerLabel = getNextPrayerLabel(prayerTimes, new Date());

  return <LandingPage preview="desktop" nextPrayerLabel={nextPrayerLabel} />;
}
