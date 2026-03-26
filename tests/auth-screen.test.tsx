import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignInScreen } from "@/features/auth/components/sign-in-screen";
import { renderWithProviders } from "@/tests/render";

describe("SignInScreen", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);

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

  it("renders the sign-in form", () => {
    renderWithProviders(<SignInScreen />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
