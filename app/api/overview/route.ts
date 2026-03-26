import { NextResponse } from "next/server";
import { getOverviewData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getOverviewData());
}
