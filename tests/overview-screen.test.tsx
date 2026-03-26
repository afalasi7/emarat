import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OverviewScreen } from "@/features/overview/components/overview-screen";
import { renderWithProviders } from "@/tests/render";

describe("OverviewScreen", () => {
  it("renders the overview hero and rhythm section", () => {
    renderWithProviders(<OverviewScreen />);
    expect(screen.getByText("Asr in 01:12")).toBeInTheDocument();
    expect(screen.getByText("Today's rhythm")).toBeInTheDocument();
  });
});
