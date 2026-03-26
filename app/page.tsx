import { headers } from "next/headers";
import { LandingPage } from "@/features/landing/components/landing-page";
import { getNextPrayerLabel } from "@/lib/server/aladhan";
import { getPrayerTimesData } from "@/lib/server/services";
import { getLandingPreviewFromUserAgent } from "@/lib/viewport-routing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headersList = await headers();
  const preview = getLandingPreviewFromUserAgent(headersList.get("user-agent"));
  const { prayerTimes } = await getPrayerTimesData();
  const nextPrayerLabel = getNextPrayerLabel(prayerTimes, new Date());

  return <LandingPage preview={preview} nextPrayerLabel={nextPrayerLabel} />;
}
