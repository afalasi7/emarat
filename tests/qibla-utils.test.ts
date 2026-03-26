import { describe, expect, it } from "vitest";
import {
  buildDirectionLabel,
  getDirectionDelta,
  getDirectionTurn,
  mockQiblaBearingService,
} from "@/lib/qibla";

describe("qibla utilities", () => {
  it("returns the smallest directional delta", () => {
    expect(getDirectionDelta(245, 259)).toBe(14);
  });

  it("returns direction labels with left and right turn context", () => {
    expect(getDirectionTurn(245, 259)).toEqual({ degrees: 14, turn: "right" });
    expect(getDirectionTurn(259, 245)).toEqual({ degrees: 14, turn: "left" });
    expect(buildDirectionLabel(245, 246)).toBe("Aligned with Qibla");
  });

  it("returns mock qibla data", async () => {
    const data = await mockQiblaBearingService.getQiblaData({
      deviceHeading: 245,
    });
    expect(data.directionLabel).toBe("Turn right 14°");
  });
});
