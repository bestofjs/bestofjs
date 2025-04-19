import { renderApp, screen } from "test-utils";
import userEvent from "@testing-library/user-event";

describe("Dark Mode", () => {
  it("switch between light mode and dark mode", async () => {
    renderApp();
    // Default is dark mode
    // Should have Dark mode class name in document.body + dark mode logo
    expect(document.body.className).toBe("chakra-ui-dark");
    expect(
      (screen.getByAltText("Best of JS") as HTMLImageElement).src
    ).toContain("/src/components/header/bestofjs-logo-dark.svg");

    // Toggle light mode
    userEvent.click(await screen.findByLabelText("Light mode"));

    // Should have Light mode class name in document.body + light mode logo
    expect(document.body.className).toBe("chakra-ui-light");
    expect(
      (screen.getByAltText("Best of JS") as HTMLImageElement).src
    ).toContain("/src/components/header/bestofjs-logo-light.svg");
  });
});
