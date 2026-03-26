import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/server/route-auth";
import { getReminders } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireSessionUser();
    return NextResponse.json(await getReminders());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
