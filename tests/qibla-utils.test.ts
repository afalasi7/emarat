import { describe, expect, it } from "vitest";
import { getDirectionDelta, mockQiblaBearingService } from "@/lib/qibla";

describe("qibla utilities", () => {
  it("returns the smallest directional delta", () => {
    expect(getDirectionDelta(245, 259)).toBe(14);
  });

  it("returns mock qibla data", async () => {
    const data = await mockQiblaBearingService.getQiblaData({
      deviceHeading: 245,
    });
    expect(data.directionLabel).toBe("Turn right 14°");
  });
});
