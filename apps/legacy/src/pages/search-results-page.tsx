import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Button,
  EmptyContent,
  Flex,
  MainContent,
  PageHeader,
  Spinner,
} from "components/core";
import { TagIcon } from "components/core/icons";
import { PaginationContainer } from "components/core/pagination";
import { findProjects } from "components/search/find-projects";
import { ProjectPaginatedList } from "components/search/project-paginated-list";
import { useSearch } from "components/search/search-container";
import { useNextLocation } from "components/search/search-utils";
import { ProjectTagGroup } from "components/tags/project-tag";
import { useSelector } from "containers/project-data-container";
import { allProjects, getProjectSelectorByKey, getTagsByCode } from "selectors";

export const SearchResultsPage = () => {
  const { selectedTags, query, sortOptionId, direction, page } = useSearch();
  const limit = 30;

  const projects = useSelector(allProjects);
  const tags = useSelector((state) => state.entities.tags);
  const auth = useSelector((state) => state.auth);

  if (projects.length === 0) return <Spinner />;

  const selector = getProjectSelectorByKey(sortOptionId);

  const {
    results: foundProjects,
    total,
    relevantTags,
  } = findProjects(projects, tags, auth, {
    tags: selectedTags,
    query,
    page,
    selector,
    limit,
    direction: direction || "desc",
  });

  const includedTags =
    relevantTags && relevantTags.slice(0, 5).map(([tagId]) => tagId);

  return (
    <MainContent>
      {foundProjects.length > 0 ? (
        <PaginationContainer.Provider
          initialState={{ total, limit, currentPageNumber: page }}
        >
          <SearchResultsTitle
            query={query}
            selectedTags={selectedTags}
            total={total}
          />
          {includedTags.length > 0 && <RelevantTags tagIds={includedTags} />}
          <ProjectPaginatedList
            projects={foundProjects}
            total={total}
            sortOptionId={sortOptionId}
          />
        </PaginationContainer.Provider>
      ) : (
        <EmptyContent>
          <NoProjectsFound query={query} selectedTags={selectedTags} />
        </EmptyContent>
      )}
    </MainContent>
  );
};

const SearchResultsTitle = ({ query, selectedTags, total }) => {
  const isListFiltered = query !== "" || selectedTags.length > 0;
  const tags = useSelector(getTagsByCode(selectedTags));

  if (!isListFiltered) return <PageHeader title="All Projects" />;

  if (tags.length > 0 && !query) {
    return (
      <PageHeader
        title={tags.map((tag) => tag.name).join(" + ")}
        icon={<TagIcon size={32} />}
        subTitle={showCount(total, "project")}
      />
    );
  }
  return (
    <PageHeader
      title="Search"
      subTitle={`${showCount(total, "project")} found`}
    >
      Search results
    </PageHeader>
  );
};

const showCount = (total, text) => {
  if (total === 0) return `no ${text}`;
  return `${total} ${text}${total > 1 ? "s" : ""}`;
};

const NoProjectsFound = ({ query, selectedTags }) => {
  const { navigate } = useNextLocation();
  const tags = useSelector(getTagsByCode(selectedTags)).filter((tag) => !!tag);
  const Title = () => {
    const QueryPart = () => {
      if (!query) return null;
      return <> "{query}" </>;
    };
    const TagPart = () => {
      if (!tags.length) return null;
      if (tags.length === 1) return <> with the tag "{tags[0].name}"</>;
      return (
        <> with the tags {tags.map((tag) => `"${tag.name}"`).join(" and ")}</>
      );
    };

    return (
      <div style={{ marginBottom: "1rem" }}>
        No project
        <QueryPart /> was found
        <TagPart />.
      </div>
    );
  };

  return (
    <>
      <Title />
      <Button as={Link} to="/projects">
        View all projects
      </Button>

      {tags.length > 0 && query && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>Reset the query:</div>
          <Button onClick={() => navigate({ query: "" })}>
            <span style={{ textDecoration: "line-through" }}>{query}</span>
          </Button>
        </div>
      )}

      {tags.length > 1 && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            Or select only <b>one</b> tag:
          </div>
          <ProjectTagGroup tags={tags} />
        </div>
      )}
    </>
  );
};

const RelevantTags = ({ tagIds }) => {
  const tags = useSelector(getTagsByCode(tagIds));
  const { selectedTags } = useSearch();

  return (
    <Container>
      <Flex alignItems="center">
        <Label>
          {selectedTags.length === 0 ? "Related tags:" : "Refine your search:"}
        </Label>
        <ProjectTagGroup tags={tags} appendTag={selectedTags.length > 0} />
      </Flex>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  padding-right: 0.5rem;
  @media (max-width: 599px) {
    display: none;
  }
`;
