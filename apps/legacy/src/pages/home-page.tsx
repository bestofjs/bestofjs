import React, { useState } from "react";
import { Home } from "components/home/home";
import type { SortOptionKey } from "components/search/sort-order-options";
import {
  ProjectDataContainer,
  useSelector,
} from "containers/project-data-container";
import {
  getNewestProjects,
  getPopularTags,
  getProjectsSortedBy,
} from "selectors";

const HomePage = () => {
  const state = ProjectDataContainer.useContainer();

  const [sortOptionId, setSortOptionId] = useState<SortOptionKey>("daily");

  const hotProjects = useSelector(
    getProjectsSortedBy({
      filterFn: isIncludedInHotProjects,
      criteria: sortOptionId,
      limit: 5,
      start: 0,
    }),
  );

  const tagCount = 10;
  const popularTags = getPopularTags(tagCount)(state);

  const newestProjectCount = 5;
  const newestProjects = getNewestProjects(newestProjectCount)(state);

  // return <Home pending={true} popularTags={[]} newestProjects={[]} />;
  return (
    <Home
      pending={state.isPending}
      hotProjects={hotProjects}
      popularTags={popularTags}
      newestProjects={newestProjects}
      sort={sortOptionId}
      onChangeSort={setSortOptionId}
    />
  );
};

const hotProjectsExcludedTags = ["meta", "learning"];

export const isIncludedInHotProjects = (project) => {
  const hasExcludedTag = hotProjectsExcludedTags.some((tag) =>
    project.tags.includes(tag),
  );
  return !hasExcludedTag;
};

export default HomePage;
