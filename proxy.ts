import { NextResponse, userAgent, type NextRequest } from "next/server";
import { getViewportRedirectPath } from "@/lib/viewport-routing";

export function proxy(request: NextRequest) {
  const { device, isBot } = userAgent(request);
  if (isBot) {
    return NextResponse.next();
  }

  const previewParam = request.nextUrl.searchParams.get("preview");
  const previewPreference =
    previewParam === "mobile" || previewParam === "desktop"
      ? previewParam
      : (request.cookies.get("emarat-preview")?.value as
          | "mobile"
          | "desktop"
          | undefined);

  const redirectPath = getViewportRedirectPath({
    deviceType: device.type,
    pathname: request.nextUrl.pathname,
    preferredPreview: previewPreference,
  });

  if (!redirectPath || redirectPath === request.nextUrl.pathname) {
    const response = NextResponse.next();

    if (previewParam === "mobile" || previewParam === "desktop") {
      response.cookies.set("emarat-preview", previewParam, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  }

  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = redirectPath;
  const response = NextResponse.redirect(nextUrl);

  if (previewParam === "mobile" || previewParam === "desktop") {
    response.cookies.set("emarat-preview", previewParam, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
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
