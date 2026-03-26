import { NextRequest, NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/server/route-auth";
import { updateReminder } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reminderId: string }> },
) {
  try {
    await requireSessionUser();
    const body = await request.json();
    const { reminderId } = await context.params;
    return NextResponse.json(await updateReminder(reminderId, body));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update reminder";
    const status = message === "Sign in to access synced data" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
