import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrayerTimesScreen } from "@/features/prayer-times/components/prayer-times-screen";
import { renderWithProviders } from "@/tests/render";

describe("PrayerTimesScreen", () => {
  it("renders prayer cards and summary content", () => {
    renderWithProviders(<PrayerTimesScreen />);
    expect(screen.getByText("Prayer window")).toBeInTheDocument();
    expect(screen.getByText("Auto mute on")).toBeInTheDocument();
  });
});
