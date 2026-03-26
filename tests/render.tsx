import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { ThemeProvider } from "next-themes";

export function renderWithProviders(ui: ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {ui}
    </ThemeProvider>,
  );
}
