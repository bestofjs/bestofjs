import { screen, renderApp, debug } from "test-utils";
import userEvent from "@testing-library/user-event";

describe("Tags", () => {
  const getAllTags = () => screen.getAllByTestId("tag-card");
  it("should render correctly", async () => {
    renderApp();
    // Navigate to Tags page
    userEvent.click(screen.getByTestId("menu-tags"));

    // Sort by number of project should be the default option
    await screen.findByText("by number of projects");
    // Should have 20 tags
    let allTags = getAllTags();
    expect(allTags).toHaveLength(20);
    // "React" should be at the top of the list
    expect(allTags.at(0)?.innerHTML).toContain("React");

    // Sort by alphabetical order
    userEvent.click(screen.getByTestId("tag-list-sort-order-picker"));
    userEvent.click(screen.getByText("alphabetical order"));
    // Should have 20 tags
    allTags = getAllTags();
    expect(allTags).toHaveLength(20);
    // "3D" should be at the top of the list
    expect(allTags.at(0)?.innerHTML).toContain("3D");

    // Previous page should be disabled
    expect(screen.getByTestId("previous-page-top")).toBeDisabled();
    expect(screen.getByTestId("previous-page-bottom")).toBeDisabled();
    // Next page should be enabled
    expect(screen.getByTestId("next-page-top")).toBeEnabled();
    // Click Next page
    userEvent.click(screen.getByTestId("next-page-top"));
    // Should have 20 tags
    allTags = getAllTags();
    expect(allTags).toHaveLength(20);
    // "Building tool" should be at the top of the list
    expect(allTags.at(0)?.innerHTML).toContain("Building tool");

    // Click "Last Page"
    userEvent.click(screen.getByLabelText("Last page"));
    // Should have 17 tags
    allTags = getAllTags();
    expect(allTags).toHaveLength(17);

    // "XML" should be at the bottom of the list
    expect(allTags.at(16)?.innerHTML).toContain("XML");

    // Click "First Page"
    userEvent.click(screen.getByLabelText("First page"));
    // Should have 20 tags
    allTags = getAllTags();
    expect(allTags).toHaveLength(20);
    // "Browser storage" should be at the bottom of the list
    expect(allTags.at(19)?.innerHTML).toContain("Browser storage");

    // OPEN A TAG
    // Assert this bug https://github.com/bestofjs/bestofjs-webui/pull/142
    // Sort by number of projects
    userEvent.click(screen.getByTestId("tag-list-sort-order-picker"));
    userEvent.click(screen.getByText("by number of projects"));
    // Select Component Toolkit
    userEvent.click(screen.getByText("Component Toolkit"));
    // Go to Next Page
    userEvent.click(screen.getByTestId("next-page-top"));
    // Select Design System tag
    userEvent.click(screen.getAllByText("Design System").at(1) as HTMLElement); // The first one is "Refine your search"
    // Should see Design System, 23 projects
    await screen.findByText("23 projects");
    const allProjects = await screen.findAllByTestId("project-card");
    expect(allProjects).toHaveLength(23);
    // "Ant Design" should be at the top of the list
    expect(allProjects.at(0)?.innerHTML).toContain("Ant Design");

    // If you update this file, uncomment to preview UI real time in Chrome
    // debug();
  });
});
