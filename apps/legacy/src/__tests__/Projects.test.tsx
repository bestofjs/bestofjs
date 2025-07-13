import userEvent from "@testing-library/user-event";
import {
  renderApp,
  screen,
  // debug,
} from "test-utils";

describe("Projects", () => {
  const getAllProjects = () => screen.findAllByTestId("project-card");

  it("should render correctly", async () => {
    renderApp();
    // Navigate to Projects page
    userEvent.click(await screen.findByTestId("menu-projects"));

    // Sort by number of stars should be the default option
    await screen.findByText("By total number of stars");
    // Should have 30 projects
    let allProjects = await getAllProjects();
    expect(allProjects).toHaveLength(30);
    // "freeCodeCamp" should be at the top of the list
    expect(allProjects.at(0)?.innerHTML).toContain("freeCodeCamp");
    // Right arrow should be disabled
    expect(screen.getByTestId("previous-page-top")).toBeDisabled();
    expect(screen.getByTestId("previous-page-bottom")).toBeDisabled();

    // Click Next Page
    userEvent.click(screen.getByTestId("next-page-top"));
    // "json-server" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("json-server");

    // Click Last Page
    userEvent.click(screen.getByLabelText("Last page"));
    // "Your First RPG" should be at the bottom of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(14)?.innerHTML).toContain("Your First RPG");

    // Click First Page
    userEvent.click(screen.getByLabelText("First page"));
    // "Clean Code" should be at the bottom of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(29)?.innerHTML).toContain("Clean Code");

    // Sort by stars added yesterday
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(await screen.findByText("By stars added yesterday"));
    // "Vite" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("Vite");

    // Sort by stars added the last 7 days
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(await screen.findByText("By stars added the last 7 days"));
    // "Solid" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("Solid");

    // Sort by stars added the last 30 days
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(await screen.findByText("By stars added the last 30 days"));
    // "Tauri" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("Tauri");

    // Sort by stars added the last 12 months
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(
      await screen.findByText("By stars added the last 12 months"),
    );
    // "JS Algorithms & Data Structures" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain(
      "JS Algorithms &amp; Data Structures",
    );

    // Sort by downloads the last 30 days
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(await screen.findByText("By downloads the last 30 days"));
    // "Debug" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("Debug");

    // Sort by date of the latest commit
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(await screen.findByText("By date of the latest commit"));
    // "freeCodeCamp" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("freeCodeCamp");

    // Sort by number of contributors
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(await screen.findByText("By number of contributors"));
    // "DefinitelyTyped" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("DefinitelyTyped");

    // Sort by date of creation (Oldest first)
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(
      await screen.findByText("By date of creation (Oldest first)"),
    );
    // "Raphael" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("Raphael");

    // Sort by date of addition on Best of JS
    userEvent.click(await screen.findByTestId("sort-order-picker"));
    userEvent.click(
      await screen.findByText("By date of addition on Best of JS"),
    );
    // "google-spreadsheet" should be at the top of the list
    allProjects = await getAllProjects();
    expect(allProjects.at(0)?.innerHTML).toContain("google-spreadsheet");

    // If you update this file, uncomment to preview UI real time in Chrome
    // debug();
  });
});
