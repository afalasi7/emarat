import { redirect } from "next/navigation";
import { SignUpScreen } from "@/features/auth/components/sign-up-screen";
import { readSessionUserFromCookies } from "@/lib/server/route-auth";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const sessionUser = await readSessionUserFromCookies();
  if (sessionUser) {
    redirect("/overview");
  }

  return <SignUpScreen />;
}
