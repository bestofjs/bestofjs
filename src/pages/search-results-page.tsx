import React from "react";
import { withRouter } from "react-router-dom";
import styled from "@emotion/styled";

import { useSelector } from "containers/project-data-container";
import { allProjects, getTagsById, getProjectSelectorByKey } from "selectors";
import { PaginationContainer } from "components/core/pagination";
import { TagIcon } from "components/core/icons";
import {
  Button,
  EmptyContent,
  Flex,
  MainContent,
  PageHeader,
  Spinner,
} from "components/core";
import { ProjectPaginatedList } from "components/search/project-paginated-list";
import { ProjectTagGroup } from "components/tags/project-tag";
import { useSearch } from "components/search/search-container";
import { updateLocation } from "components/search/search-utils";
import { findProjects } from "components/search/find-projects";

export const SearchResultsPage = () => {
  const { selectedTags, query, sortOption, page } = useSearch();
  const limit = 30;

  const projects = useSelector(allProjects);
  const tags = useSelector((state) => state.entities.tags);
  const auth = useSelector((state) => state.auth);

  if (projects.length === 0) return <Spinner />;

  const selector = getProjectSelectorByKey(sortOption.id);

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
    direction: sortOption.direction || "desc",
  });

  const includedTags =
    relevantTags && relevantTags.slice(0, 5).map(([tagId, count]) => tagId);

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
          {includedTags.length > 0 && (
            <RelevantTags tagIds={includedTags} baseTagIds={selectedTags} />
          )}
          <ProjectPaginatedList
            projects={foundProjects}
            page={page}
            total={total}
            limit={limit}
            sortOption={sortOption}
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
  const tags = useSelector(getTagsById(selectedTags));

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

const NoProjectsFound = withRouter(
  ({ query, selectedTags, history, location }) => {
    const tags = useSelector(getTagsById(selectedTags)).filter((tag) => !!tag);
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

    const resetQuery = () => {
      const nextLocation = updateLocation(location, { query: "" });
      history.push(nextLocation);
    };
    return (
      <>
        <Title />
        <Button onClick={() => history.push("/projects")}>
          View all projects
        </Button>

        {tags.length > 0 && query && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ marginBottom: "1rem" }}>Reset the query:</div>
            <Button onClick={resetQuery}>
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
  }
);

const RelevantTags = ({ tagIds, baseTagIds }) => {
  const tags = useSelector(getTagsById(tagIds));
  return (
    <Container>
      <Flex alignItems="center">
        <Label>
          {baseTagIds.length === 0 ? "Related tags:" : "Refine your search:"}
        </Label>
        <ProjectTagGroup tags={tags} baseTagIds={baseTagIds} />
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
