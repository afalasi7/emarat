const mobileToDesktopPathMap = {
  "/overview": "/desktop/overview",
  "/prayer-times": "/desktop/prayer-times",
  "/qibla": "/desktop/qibla",
  "/settings": "/desktop/settings",
  "/sign-in": "/desktop/sign-in",
  "/sign-up": "/desktop/sign-up",
} as const;

const desktopToMobilePathMap = {
  "/desktop": "/",
  ...Object.fromEntries(
    Object.entries(mobileToDesktopPathMap).map(([mobilePath, desktopPath]) => [
      desktopPath,
      mobilePath,
    ]),
  ),
} as Record<string, string>;

const mobileDeviceTypes = new Set(["mobile", "tablet", "wearable"]);
const mobileUserAgentPattern =
  /android|iphone|ipad|ipod|mobile|tablet|silk|kindle|blackberry|opera mini|iemobile/i;

export function getViewportRedirectPath(input: {
  deviceType?: string | undefined;
  pathname: string;
}) {
  const { deviceType, pathname } = input;
  const desktopPath = mobileToDesktopPathMap[pathname as keyof typeof mobileToDesktopPathMap];
  const mobilePath = desktopToMobilePathMap[pathname];
  const isMobileLike = deviceType ? mobileDeviceTypes.has(deviceType) : false;

  if (isMobileLike && mobilePath) {
    return mobilePath;
  }

  if (!isMobileLike && desktopPath) {
    return desktopPath;
  }

  return null;
}

export function getLandingPreviewFromUserAgent(userAgent: string | null | undefined) {
  if (!userAgent) {
    return "mobile" as const;
  }

  return mobileUserAgentPattern.test(userAgent) ? "mobile" : "desktop";
}
