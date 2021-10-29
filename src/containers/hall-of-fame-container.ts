import { createContainer } from "unstated-next";
import useSWR from "swr";

import api from "api/config";
import { fetchJSON } from "helpers/fetch";
import { ProjectDataContainer } from "./project-data-container";

export function useHallOfFame() {
  const { data, error } = useSWR("/api/hall-of-fame", fetchHeroes);
  const {
    entities: { projects: projectsById },
  } = ProjectDataContainer.useContainer();

  const heroes = data?.map(populateHero(projectsById)) || [];
  return { heroes, error, isPending: !data };
}

export const HallOfFameContainer = createContainer(useHallOfFame);

function fetchHeroes() {
  const url = `${api("GET_PROJECTS")}/hof.json`;
  return fetchJSON(url).then((data) => data.heroes);
}

export const populateHero = (projectsById) => (hero) => {
  const projects = hero.projects.map((projectId) => projectsById[projectId]);
  return { ...hero, projects };
};
