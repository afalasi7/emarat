import { NextRequest, NextResponse } from "next/server";
import { getQiblaData } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const heading = Number(request.nextUrl.searchParams.get("heading") ?? "245");
  return NextResponse.json(await getQiblaData(Number.isFinite(heading) ? heading : 245));
}
