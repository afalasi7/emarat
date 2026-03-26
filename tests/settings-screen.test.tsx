import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsScreen } from "@/features/settings/components/settings-screen";
import { renderWithProviders } from "@/tests/render";

describe("SettingsScreen", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);

      if (url.includes("/api/settings")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              settings: {
                calculationMethod: "UAE method",
                madhab: "Hanafi",
                language: "English",
                themePreference: "system",
                quietMode: true,
                travelMode: false,
                notificationWindowMinutes: 12,
              },
              reminders: [
                {
                  id: "r-1",
                  prayerName: "Maghrib",
                  label: "Quiet reminder",
                  offsetMinutes: -12,
                  enabled: true,
                  mode: "vibration",
                },
              ],
              devices: [
                {
                  id: "device-phone",
                  name: "iPhone 16 Pro",
                  kind: "phone",
                  synced: true,
                  lastActive: "2 min ago",
                },
              ],
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            },
          ),
        );
      }

      if (url.includes("/api/auth/session")) {
        return Promise.resolve(
          new Response(JSON.stringify({ user: null }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }),
        );
      }

      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });
  });

  it("renders settings cards and synced devices", () => {
    renderWithProviders(<SettingsScreen />);
    expect(screen.getByText("Reminders")).toBeInTheDocument();
    expect(screen.getByText("Reminder routing")).toBeInTheDocument();
    expect(screen.getByText("Synced devices")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /system/i }),
    ).toBeInTheDocument();
  });
});
