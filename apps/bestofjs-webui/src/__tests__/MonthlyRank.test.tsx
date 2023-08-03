import userEvent from "@testing-library/user-event";
import { renderApp, screen, within } from "test-utils";

export {};

describe("Monthly Ranking", () => {
  it("should render correctly", async () => {
    renderApp();

    // Navigate to Monthly Ranking
    const menuMore = screen.getAllByTestId("menu-more").at(0) as HTMLElement;
    userEvent.click(menuMore);
    userEvent.click(screen.getByTestId("menu-monthly"));
    await screen.findByText("Monthly Rankings");

    // APRIL 2022
    await screen.findByText("April 2022");
    // Should see Remotion is the rank #1
    const homeMonthlyRankingProjectsLatest = await screen.findAllByTestId(
      "project-card"
    );
    // Should have 50 projects
    expect(homeMonthlyRankingProjectsLatest).toHaveLength(50);
    // Next.js should be the first project
    await within(
      homeMonthlyRankingProjectsLatest.at(0) as HTMLElement
    ).findByText("The React Framework");

    // Right arrow should be disabled
    expect(screen.getByLabelText("Next month")).toBeDisabled();
    // Left arrow should be enabled
    const previousMonthButton = screen.getByLabelText("Previous month");
    expect(previousMonthButton).toBeEnabled();

    // Click on the left arrow
    userEvent.click(previousMonthButton);

    // MARCH 2022
    await screen.findByText("March 2022");
    // Should see Remotion is the rank #1
    const homeMonthlyRankingProjectsLastMonth = await screen.findAllByTestId(
      "project-card"
    );
    // Should have 50 projects
    expect(homeMonthlyRankingProjectsLastMonth).toHaveLength(50);
    // Remotion should be the first project
    await within(
      homeMonthlyRankingProjectsLastMonth.at(0) as HTMLElement
    ).findByText("Remotion");
  });
});
