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

    // If you update this file, uncomment to preview UI real time in Chrome
    // debug();
  });
});
