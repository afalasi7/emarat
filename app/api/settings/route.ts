import { NextRequest, NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/server/route-auth";
import { getSettingsBundle, updateSettings } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireSessionUser();
    return NextResponse.json(await getSettingsBundle());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireSessionUser();
    const body = await request.json();
    return NextResponse.json(await updateSettings(body));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    const status = message === "Sign in to access synced data" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
