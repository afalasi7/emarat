import { redirect } from "next/navigation";
import { SignInScreen } from "@/features/auth/components/sign-in-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (sessionUser) {
    redirect("/overview");
  }

  return <SignInScreen />;
}
