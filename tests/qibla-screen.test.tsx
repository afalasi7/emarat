import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QiblaScreen } from "@/features/qibla/components/qibla-screen";
import { renderWithProviders } from "@/tests/render";

describe("QiblaScreen", () => {
  it("renders qibla direction guidance", () => {
    renderWithProviders(<QiblaScreen />);
    expect(screen.getByText("Turn right 14°")).toBeInTheDocument();
    expect(screen.getByText("Friendly guide")).toBeInTheDocument();
  });
});
