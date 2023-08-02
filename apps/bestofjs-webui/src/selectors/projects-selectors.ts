import { createSelector } from "reselect";

import { sortProjectsByFunction } from "./sort-utils";
import { State } from "containers/project-data-container";

export const allProjects = createSelector<State, any, BestOfJS.Project[]>(
  [(state) => state.entities.projects],
  (projectsById) => Object.values(projectsById)
);

export const getAllProjectsCount = createSelector(
  [allProjects],
  (projects) => projects.length
);

export const npmProjects = createSelector([allProjects], (projects) =>
  projects.filter((project) => !!project.packageName)
);

const sortProjects = (fn) => (projects) => sortProjectsByFunction(projects, fn);

// a sub-selector used by both `getProjectsSortedBy` and `getProjectsByTag`
const getRawProjectsSortedBy = ({
  filterFn,
  criteria,
  start = 0,
  limit = 10,
}) => {
  return createSelector([allProjects], (projects) => {
    const filteredProjects = filterFn ? projects.filter(filterFn) : projects;
    const projectSelector = getProjectSelectorByKey(criteria);
    const sliced = sortProjects(projectSelector)(filteredProjects).slice(
      start,
      start + limit
    );
    return sliced;
  });
};

// Create a selector for a given criteria (`total`, `daily`)
export const getProjectsSortedBy = ({
  criteria,
  filterFn,
  start,
  limit,
}: {
  criteria: any;
  filterFn?: any;
  start?: number;
  limit?: number;
}) =>
  createSelector(
    [
      getRawProjectsSortedBy({ filterFn, criteria, start, limit }),
      (state) => state.entities.tags,
      (state) => state.auth,
    ],
    (projects, tags, auth) => projects.map(getFullProject(tags, auth))
  );

export const getNewestProjects = (count) =>
  getProjectsSortedBy({
    criteria: "newest",
    limit: count,
  });

export const getAllProjectsByTag = (tagId) =>
  createSelector([allProjects], (projects) =>
    projects.filter((project) => project.tags.includes(tagId))
  );

// Selector used to display the list of projects belonging to a given tag
export const getProjectsByTag = ({ criteria, tagId }) =>
  createSelector(
    [getAllProjectsByTag(tagId), (state) => state.entities.tags],
    (projects) => {
      const projectSelector = getProjectSelectorByKey(criteria);
      return sortProjects(projectSelector)(projects);
    }
  );

export const getBookmarksSortedBy = (criteria) =>
  createSelector<State, any, any, BestOfJS.Project[]>(
    [
      (state) => {
        return state.entities.projects;
      },
      (state) => state.auth,
      (state) => state.entities.tags,
    ],
    (projects, auth, tags) => {
      if (!auth.myProjects) return [];
      const myProjectsSlugs = auth.myProjects.map((item) => item.slug);
      const result = myProjectsSlugs
        .map((slug) => projects[slug])
        .filter((project) => !!project)
        .map(getFullProject(tags, auth));
      const projectSelector = getProjectSelectorByKey(criteria);
      return sortProjects(projectSelector)(result);
    }
  );

export const getBookmarkCount = createSelector<State, any, number>(
  (state) => state.auth.myProjects,
  (ids) => {
    return ids.length;
  }
);

export const getFeaturedProjects = (criteria) =>
  createSelector(
    [allProjects, (state) => state.entities.tags, (state) => state.auth],
    (projects, tags, auth) => {
      const featured = projects
        .filter((project) => !!project.icon)
        .filter((project) => project.stars > 1000)
        .map(getFullProject(tags, auth));
      const projectSelector = getProjectSelectorByKey(criteria);
      return sortProjects(projectSelector)(featured);
    }
  );

export const getFullProject = (tags, auth) => (project) => {
  const { myProjects = [], pendingProject } = auth;
  const fullProject = populateProject(tags)(project);
  const pending = project.slug === pendingProject;
  const bookmark = myProjects.find(({ slug }) => slug === project.slug);
  const isBookmark = !!bookmark;

  return {
    ...fullProject,
    ...(bookmark
      ? { isBookmark, bookmarked_at: bookmark.bookmarked_at }
      : undefined),
    pending,
  };
};

export const getTotalNumberOfStars = (project) => project.stars;

export const getStarsAddedDaily = ({ trends }) => trends.daily;

export const getStarsAddedWeekly = ({ trends }) => trends.weekly;

export const getStarsAddedMonthly = ({ trends }) => trends.monthly;

export const getStarsAddedYearly = ({ trends }) => trends.yearly;

export const getLastCommitDate = (project) => new Date(project.pushed_at);

export const getContributorCount = (project) => project.contributor_count;

export const getBookmarkDate = (project) => new Date(project.bookmarked_at);

export const getProjectSelectorByKey = (key) => {
  const sortFn = {
    total: getTotalNumberOfStars,
    daily: getStarsAddedDaily,
    weekly: getStarsAddedWeekly,
    monthly: getStarsAddedMonthly,
    yearly: getStarsAddedYearly,
    bookmark: getBookmarkDate,
    "last-commit": getLastCommitDate,
    contributors: getContributorCount,
    match: ({ rank }) => rank, // only used when a `query` is used to search, a ranking score is assigned to projects
    "monthly-downloads": ({ downloads }) => downloads,
    newest: (project) => project.addedPosition,
    created: (project) => new Date(project.created_at),
  };

  if (!sortFn[key]) throw new Error(`No selector for the key "${key}"`);
  return sortFn[key];
};

// Return a full `project` object, including `tags`
// to be used by `/projects/:id` pages
export const findProjectById = (slug) =>
  createSelector<State, BestOfJS.Project[], any, BestOfJS.Project>(
    [(state) => state.entities.projects, (state) => state.entities.tags],
    (projects, tags) => {
      const project = projects[slug];
      // `project` can be not found if the entities have not been loaded yet,
      //  e.g. when `/projects/:id` URL is loaded directly in the browser.
      if (!project) return null;
      return {
        ...populateProject(tags)(project),
        slug,
      };
    }
  );

export const findProjectsByIds = (ids) =>
  createSelector<State, any, any, BestOfJS.Project[]>(
    [(state) => state.entities.projects, (state) => state.entities.tags],
    (projects, tags) => {
      return ids.map((slug) => {
        const project = projects[slug];
        return project
          ? {
              ...populateProject(tags)(project),
              slug,
            }
          : null;
      });
    }
  );

// Update `tags` populated objects to a `project` object that contains only an array of tag ids
export function populateProject(tags) {
  return function (project) {
    if (!project) throw new Error("populate() called with NO PROJECT!");
    const populated = {
      ...project,
      repository: "https://github.com/" + project.full_name,
      tags: project.tags.map((id) => tags[id]).filter((tag) => !!tag),
    };
    return populated;
  };
}
