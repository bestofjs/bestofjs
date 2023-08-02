import { renderApp, screen } from "test-utils";
import userEvent from "@testing-library/user-event";

describe("Static Pages", () => {
  it("should render correctly", async () => {
    renderApp();
    const menuMore = screen.getAllByTestId("menu-more").at(0) as HTMLElement;

    // About
    userEvent.click(menuMore);
    userEvent.click(screen.getByTestId("menu-about"));
    await screen.findByText("Why Best of JS?");
    await screen.findByText("Show your support!");

    // Timeline
    userEvent.click(menuMore);
    userEvent.click(screen.getByTestId("menu-timeline"));
    await screen.findByText("Timeline: 2006-2020 in 20 projects");
    // Should always render 20 projects in the timeline
    const allProjects = screen.getAllByTestId("timeline-project-index");
    expect(allProjects.length).toBe(20);
    // Should be in the ascending order
    for (let i = 0; i < allProjects.length; i++) {
      expect(allProjects.at(i)?.innerHTML).toBe(`#${i + 1}`);
    }
  });
});
