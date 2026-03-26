import { mockQiblaData } from "@/lib/mock-data";
import type { QiblaData } from "@/types/domain";

export interface QiblaBearingInput {
  deviceHeading: number;
}

export interface QiblaBearingService {
  getQiblaData(input: QiblaBearingInput): Promise<QiblaData>;
}

export function getSignedDirectionDelta(
  deviceHeading: number,
  targetBearing: number,
) {
  return ((targetBearing - deviceHeading + 540) % 360) - 180;
}

export function getDirectionDelta(
  deviceHeading: number,
  targetBearing: number,
) {
  const delta = getSignedDirectionDelta(deviceHeading, targetBearing);
  return Math.round(Math.abs(delta));
}

export function getDirectionTurn(
  deviceHeading: number,
  targetBearing: number,
) {
  const signedDelta = getSignedDirectionDelta(deviceHeading, targetBearing);
  const degrees = Math.round(Math.abs(signedDelta));
  return {
    degrees,
    turn: signedDelta >= 0 ? "right" : "left",
  } as const;
}

export function buildDirectionLabel(
  deviceHeading: number,
  targetBearing: number,
) {
  const { degrees, turn } = getDirectionTurn(deviceHeading, targetBearing);
  if (degrees <= 2) {
    return "Aligned with Qibla";
  }

  return `Turn ${turn} ${degrees}°`;
}

export class MockQiblaBearingService implements QiblaBearingService {
  constructor(private readonly targetBearing = 259) {}

  async getQiblaData(input: QiblaBearingInput) {
    const degrees = getDirectionDelta(input.deviceHeading, this.targetBearing);

    return {
      ...mockQiblaData,
      degrees,
      directionLabel: buildDirectionLabel(input.deviceHeading, this.targetBearing),
      alignmentState: degrees <= 2 ? "aligned" : "adjusting",
    } satisfies QiblaData;
  }
}

export const mockQiblaBearingService = new MockQiblaBearingService();
