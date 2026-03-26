import { redirect } from "next/navigation";
import { DesktopOverviewScreen } from "@/features/overview/components/desktop-overview-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";
import { getDesktopOverviewData, getDevices } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function DesktopOverviewPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/desktop/sign-in");
  }

  const [overview, devices] = await Promise.all([
    getDesktopOverviewData(),
    getDevices(),
  ]);

  return <DesktopOverviewScreen devices={devices} overview={overview} />;
}
