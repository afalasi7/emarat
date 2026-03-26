import { mockQiblaData } from "@/lib/mock-data";
import type { QiblaData } from "@/types/domain";

export interface QiblaBearingInput {
  deviceHeading: number;
}

export interface QiblaBearingService {
  getQiblaData(input: QiblaBearingInput): Promise<QiblaData>;
}

export function getDirectionDelta(
  deviceHeading: number,
  targetBearing: number,
) {
  const delta = ((targetBearing - deviceHeading + 540) % 360) - 180;
  return Math.round(Math.abs(delta));
}

export class MockQiblaBearingService implements QiblaBearingService {
  constructor(private readonly targetBearing = 259) {}

  async getQiblaData(input: QiblaBearingInput) {
    const degrees = getDirectionDelta(input.deviceHeading, this.targetBearing);

    return {
      ...mockQiblaData,
      degrees,
      directionLabel: `Turn right ${degrees}°`,
      alignmentState: degrees <= 2 ? "aligned" : "adjusting",
    } satisfies QiblaData;
  }
}

export const mockQiblaBearingService = new MockQiblaBearingService();
