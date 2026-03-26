import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DesktopQiblaScreen } from "@/features/qibla/components/desktop-qibla-screen";
import { renderWithProviders } from "@/tests/render";

describe("DesktopQiblaScreen", () => {
  it("renders desktop qibla guidance", () => {
    renderWithProviders(<DesktopQiblaScreen />);
    expect(screen.getByText("Qibla Compass")).toBeInTheDocument();
    expect(screen.getByText("Orientation cues")).toBeInTheDocument();
    expect(screen.getByText("Turn right 14°")).toBeInTheDocument();
  });
});
