import styled from "@emotion/styled";
import { MainContent, PageHeader } from "components/core";
import {
  PaginationContainer,
  paginateItemList,
} from "components/core/pagination";
import { ProjectPaginatedList } from "components/search/project-paginated-list";
import { useSearch } from "components/search/search-container";
import { useSelector } from "containers/project-data-container";
import { GoStar } from "react-icons/go";
import { getFeaturedProjects } from "selectors";

export const FeaturedPage = () => {
  const { page, sortOptionId } = useSearch({ defaultSortOptionId: "newest" });
  const projects = useSelector(getFeaturedProjects(sortOptionId));

  const total = projects.length;
  const limit = 30;
  const paginatedProjects = paginateItemList(projects, page, { limit });

  return (
    <MainContent>
      <PaginationContainer.Provider
        initialState={{ total, currentPageNumber: page, limit }}
      >
        <PageHeader title="Featured projects" icon={<GoStar fontSize={32} />} />
        <PageDescription>
          An arbitrary selection of important projects with distinct logos.
        </PageDescription>
        <ProjectPaginatedList
          projects={paginatedProjects}
          total={total}
          sortOptionId={sortOptionId}
        />
      </PaginationContainer.Provider>
    </MainContent>
  );
};

const PageDescription = styled.div`
  padding-left: 1rem;
  border-left: 2px solid #fa9e59;
  margin-bottom: 1rem;
`;
