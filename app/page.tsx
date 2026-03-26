import { headers } from "next/headers";
import { LandingPage } from "@/features/landing/components/landing-page";
import { getLandingPreviewFromUserAgent } from "@/lib/viewport-routing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headersList = await headers();
  const preview = getLandingPreviewFromUserAgent(headersList.get("user-agent"));
  return <LandingPage preview={preview} />;
}
