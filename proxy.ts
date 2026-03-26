import { NextResponse, userAgent, type NextRequest } from "next/server";
import { getViewportRedirectPath } from "@/lib/viewport-routing";

export function proxy(request: NextRequest) {
  const { device, isBot } = userAgent(request);
  if (isBot) {
    return NextResponse.next();
  }

  const redirectPath = getViewportRedirectPath({
    deviceType: device.type,
    pathname: request.nextUrl.pathname,
  });

  if (!redirectPath || redirectPath === request.nextUrl.pathname) {
    return NextResponse.next();
  }

  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = redirectPath;
  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: [
    "/",
    "/overview",
    "/prayer-times",
    "/qibla",
    "/settings",
    "/sign-in",
    "/sign-up",
    "/desktop/:path*",
  ],
};
