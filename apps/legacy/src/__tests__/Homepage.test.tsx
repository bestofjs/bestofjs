import userEvent from "@testing-library/user-event";
import {
  // eslint-disable-next-line
  debug,
  renderApp,
  screen,
  within,
} from "test-utils";

describe("Home page", () => {
  it("should render correctly", async () => {
    // Visit home page
    renderApp();
    // Should have h1
    await screen.findByText("The best of JavaScript, HTML and CSS");

    // HOT PROJECTS
    // Should have 5 projects in Hot Projects
    // Today Hot Projects
    await screen.findByText("the last 24 hours");
    const hotProjects = await within(
      await screen.findByTestId("hot-projects-section"),
    ).findAllByTestId("project-card");
    expect(hotProjects).toHaveLength(5);

    // This week Hot Projects
    userEvent.click(screen.getByTestId("hot-projects-button"));
    userEvent.click(screen.getByText("This week"));
    await screen.findByText("the last 7 days");

    // Should see project Solid in the list
    const hotProjectsThisWeek = await within(
      await screen.findByTestId("hot-projects-section"),
    ).findAllByTestId("project-card");
    // Should have 5 projects
    expect(hotProjectsThisWeek).toHaveLength(5);
    await within(hotProjectsThisWeek.at(0) as HTMLElement).findByText("Solid");

    // This month Hot Projects
    userEvent.click(screen.getByTestId("hot-projects-button"));
    userEvent.click(screen.getByText("This month"));
    await screen.findByText("the last 30 days");

    // Should see project Tauri in the list
    const hotProjectsThisMonth = await within(
      await screen.findByTestId("hot-projects-section"),
    ).findAllByTestId("project-card");
    // Should have 5 projects
    expect(hotProjectsThisMonth).toHaveLength(5);
    await within(hotProjectsThisMonth.at(0) as HTMLElement).findByText("Tauri");

    // This year Hot Projects
    userEvent.click(screen.getByTestId("hot-projects-button"));
    userEvent.click(screen.getByText("This year"));
    await screen.findByText("the last 12 months");

    // Should see project Slidev in the list
    const hotProjectsThisYear = await within(
      await screen.findByTestId("hot-projects-section"),
    ).findAllByTestId("project-card");
    // Should have 5 projects
    expect(hotProjectsThisYear).toHaveLength(5);
    await within(hotProjectsThisYear.at(1) as HTMLElement).findByText("Slidev");

    // FEATURED PROJECTS
    // Should have 5 projects in Featured Projects
    const featuredProjects = await screen.findAllByTestId("feature-project");
    expect(featuredProjects).toHaveLength(5);

    // RECENTLY ADDED PROJECTS
    // Should have 5 projects in Recently Added Projects
    const recentlyAddedProjects = await within(
      await screen.findByTestId("newest-section"),
    ).findAllByTestId("project-card");
    expect(recentlyAddedProjects).toHaveLength(5);

    // POPULAR TAGS
    // Should have 10 tags
    const popularTags = await screen.findAllByTestId("compact-tag-item");
    expect(popularTags).toHaveLength(10);

    // MONTHLY RANKINGS
    // Should have 5 projects in Monthly Rankings
    const homeMonthlyRankingProjects = await within(
      await screen.findByTestId("home-monthly-ranking-section"),
    ).findAllByTestId("project-card");
    expect(homeMonthlyRankingProjects).toHaveLength(5);
    // Should see Next.js is the rank #1 in the current month (April 2022)
    await within(homeMonthlyRankingProjects.at(0) as HTMLElement).findByText(
      "The React Framework",
    );
    // Right arrow should be disabled
    expect(screen.getByLabelText("Next month")).toBeDisabled();
    // Left arrow should be enabled
    const previousMonthButton = screen.getByLabelText("Previous month");
    expect(previousMonthButton).toBeEnabled();

    // Click on the left arrow
    userEvent.click(previousMonthButton);
    // Should show data from March 2022
    await screen.findByText("March 2022");
    // Should see Remotion is the rank #1
    const homeMonthlyRankingProjectsLastMonth = await within(
      await screen.findByTestId("home-monthly-ranking-section"),
    ).findAllByTestId("project-card");
    await within(
      homeMonthlyRankingProjectsLastMonth.at(0) as HTMLElement,
    ).findByText("Remotion");

    // If you update this file, uncomment to preview UI real time in Chrome
    // debug();
  });
});
