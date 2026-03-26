import { describe, expect, it } from "vitest";
import { getViewportRedirectPath } from "@/lib/viewport-routing";

describe("viewport routing", () => {
  it("redirects desktop requests from mobile routes to desktop routes", () => {
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
        pathname: "/settings",
      }),
    ).toBe("/desktop/settings");
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

  it("respects an explicit preview preference over device detection", () => {
    expect(
      getViewportRedirectPath({
        deviceType: "mobile",
        pathname: "/overview",
        preferredPreview: "desktop",
      }),
    ).toBe("/desktop/overview");
    expect(
      getViewportRedirectPath({
        pathname: "/",
        preferredPreview: "mobile",
      }),
    ).toBeNull();
  });
});
