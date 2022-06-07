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
    // Should have Logout button
    userEvent.click(screen.getByTestId("user-dropdown-menu"));
    expect(screen.getByText("Sign out")).toBeInTheDocument();
    // TODO: Fix issue refreshing on logout then update Log out test here
    // https://github.com/vercel/swr/discussions/870

    // If you update this file, uncomment to preview UI real time in Chrome
    // debug();
  });
});
