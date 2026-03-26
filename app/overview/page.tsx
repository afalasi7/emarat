import { redirect } from "next/navigation";
import { OverviewScreen } from "@/features/overview/components/overview-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";
import { getOverviewData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (!sessionUser) {
    redirect("/sign-in");
  }

  const overview = await getOverviewData();
  return <OverviewScreen data={overview} />;
}
