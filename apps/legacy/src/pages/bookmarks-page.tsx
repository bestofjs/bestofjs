import { EmptyContent, MainContent, PageHeader } from "components/core";
import {
  PaginationContainer,
  paginateItemList,
} from "components/core/pagination";
import { ProjectPaginatedList } from "components/search/project-paginated-list";
import { useSearch } from "components/search/search-container";
import { AuthContainer } from "containers/auth-container";
import { useSelector } from "containers/project-data-container";
import { GoBookmark } from "react-icons/go";
import { getBookmarksSortedBy } from "selectors";

const BookmarksPage = () => {
  const { page, sortOptionId } = useSearch({ defaultSortOptionId: "bookmark" });
  const { isLoggedIn } = AuthContainer.useContainer();
  const projects = useSelector(getBookmarksSortedBy(sortOptionId));

  const total = projects.length;
  const limit = 10;
  const paginatedProjects = paginateItemList(projects, page, { limit });

  return (
    <MainContent>
      {total === 0 && <EmptyList isLoggedin={isLoggedIn} />}
      {total > 0 && (
        <PaginationContainer.Provider
          initialState={{ total, currentPageNumber: page, limit }}
        >
          <PageHeader
            title="Bookmarks"
            icon={<GoBookmark size={32} />}
            subTitle={total === 1 ? "one project" : `${total} projects`}
          />
          <ProjectPaginatedList
            projects={paginatedProjects}
            total={total}
            sortOptionId={sortOptionId}
          />
        </PaginationContainer.Provider>
      )}
    </MainContent>
  );
};

export default BookmarksPage;

const EmptyList = ({ isLoggedin }) => (
  <EmptyContent>
    {isLoggedin ? (
      <div>
        <p>{"You don't have bookmarked any project."}</p>
        <p>
          Add projects you want to follow by using the `ADD BOOKMARK` button.
        </p>
      </div>
    ) : (
      <span>Please sign-in to access this feature!</span>
    )}
  </EmptyContent>
);
