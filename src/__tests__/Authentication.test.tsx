import {
  screen,
  renderApp,
  // debug,
} from "test-utils";
import userEvent from "@testing-library/user-event";

describe("Authentication.test", () => {
  it("should login successfully with Github", async () => {
    localStorage.setItem("bestofjs_id_token", "some-token");
    renderApp();
    // Mock loggedin
    // Should show signed button with Avatar inside
    await screen.findByAltText("Hung Viet Nguyen");
    // Logout
    userEvent.click(screen.getByTestId("user-dropdown-menu"));
    userEvent.click(screen.getByText("Sign out"));
    // Should see Sign in
    await screen.findByText("Sign in");

    // If you update this file, uncomment to preview UI real time in Chrome
    // debug();
  });
});
