import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/server/services";

export async function readSessionUserFromCookies() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("emarat-session")?.value;
  return getSessionUser(sessionToken);
}

export async function requireSessionUser() {
  const user = await readSessionUserFromCookies();

  if (!user) {
    throw new Error("Sign in to access synced data");
  }

  return user;
}
