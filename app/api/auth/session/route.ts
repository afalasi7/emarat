import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("emarat-session")?.value;
  const user = await getSessionUser(sessionToken);

  return NextResponse.json({ user });
}
