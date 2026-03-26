import { describe, expect, it } from "vitest";
import {
  getLandingPreviewFromUserAgent,
  getViewportRedirectPath,
} from "@/lib/viewport-routing";

describe("viewport routing", () => {
  it("keeps root on landing and redirects desktop requests for app routes", () => {
    expect(
      getViewportRedirectPath({
        pathname: "/",
      }),
    ).toBeNull();
    expect(
      getViewportRedirectPath({
        pathname: "/overview",
      }),
    ).toBe("/desktop/overview");
  });

  it("redirects mobile-like requests from desktop routes to mobile routes", () => {
    expect(
      getViewportRedirectPath({
        deviceType: "mobile",
        pathname: "/desktop",
      }),
    ).toBe("/");
    expect(
      getViewportRedirectPath({
        deviceType: "tablet",
        pathname: "/desktop/overview",
      }),
    ).toBe("/overview");
  });

  it("leaves already-correct routes alone", () => {
    expect(
      getViewportRedirectPath({
        deviceType: "mobile",
        pathname: "/",
      }),
    ).toBeNull();
    expect(
      getViewportRedirectPath({
        deviceType: "mobile",
        pathname: "/settings",
      }),
    ).toBeNull();
    expect(
      getViewportRedirectPath({
        pathname: "/desktop",
      }),
    ).toBeNull();
    expect(
      getViewportRedirectPath({
        pathname: "/desktop/settings",
      }),
    ).toBeNull();
    expect(
      getViewportRedirectPath({
        pathname: "/api/settings",
      }),
    ).toBeNull();
  });

  it("detects landing preview from user-agent", () => {
    expect(
      getLandingPreviewFromUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)",
      ),
    ).toBe("desktop");
    expect(
      getLandingPreviewFromUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      ),
    ).toBe("mobile");
  });
});
