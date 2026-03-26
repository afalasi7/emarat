import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/server/services";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await signUp(body);
    const response = NextResponse.json({ user: result.user });
    response.cookies.set("emarat-session", result.sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign up";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
