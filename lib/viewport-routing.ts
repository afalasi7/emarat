const mobileToDesktopPathMap = {
  "/": "/desktop",
  "/overview": "/desktop/overview",
  "/prayer-times": "/desktop/prayer-times",
  "/qibla": "/desktop/qibla",
  "/settings": "/desktop/settings",
  "/sign-in": "/desktop/sign-in",
  "/sign-up": "/desktop/sign-up",
} as const;

const desktopToMobilePathMap = Object.fromEntries(
  Object.entries(mobileToDesktopPathMap).map(([mobilePath, desktopPath]) => [
    desktopPath,
    mobilePath,
  ]),
) as Record<string, string>;

const mobileDeviceTypes = new Set(["mobile", "tablet", "wearable"]);

export function getViewportRedirectPath(input: {
  deviceType?: string | undefined;
  pathname: string;
  preferredPreview?: "mobile" | "desktop" | undefined;
}) {
  const { deviceType, pathname, preferredPreview } = input;
  const desktopPath = mobileToDesktopPathMap[pathname as keyof typeof mobileToDesktopPathMap];
  const mobilePath = desktopToMobilePathMap[pathname];
  const previewForcesMobile = preferredPreview === "mobile";
  const previewForcesDesktop = preferredPreview === "desktop";
  const isMobileLike = deviceType ? mobileDeviceTypes.has(deviceType) : false;

  if (previewForcesMobile && mobilePath) {
    return mobilePath;
  }

  if (previewForcesDesktop && desktopPath) {
    return desktopPath;
  }

  if (!preferredPreview && isMobileLike && mobilePath) {
    return mobilePath;
  }

  if (!preferredPreview && !isMobileLike && desktopPath) {
    return desktopPath;
  }

  return null;
}
