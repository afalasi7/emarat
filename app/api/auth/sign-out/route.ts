import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signOut } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("emarat-session")?.value;

  await signOut(sessionToken);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("emarat-session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
