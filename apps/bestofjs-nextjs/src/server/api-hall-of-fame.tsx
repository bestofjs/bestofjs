import uniqBy from "lodash/uniqBy";
import mingo from "mingo";

import { APIContext, FETCH_ALL_PROJECTS_URL } from "./api-utils";

export function createHallOfFameAPI(context: APIContext) {
  return {
    async findMembers() {
      const { populate, projectCollection, projectsBySlug } =
        await context.getData();
      const { heroes } = await fetchHallOfFameData();

      function findProjectsByOwner(owner: string) {
        const criteria = {
          full_name: { $regex: new RegExp("^" + owner + "/") },
        };
        const projects = mingo
          .find(projectCollection, criteria)
          .sort({ stars: -1 })
          .all() as BestOfJS.RawProject[];
        return projects.map(populate);
      }

      function populateMemberProjects(member: BestOfJS.RawHallOfFameMember) {
        const ownedProjects = findProjectsByOwner(member.username);
        const extraProjects: BestOfJS.Project[] = member.projects
          .map((projectSlug) => projectsBySlug[projectSlug])
          .filter(Boolean) // needed as some members are linked to deprecated projects. TODO fix Hall of fame data?
          .map(populate);

        const projects = uniqBy([...ownedProjects, ...extraProjects], "name");
        return {
          ...member,
          projects,
        } as BestOfJS.HallOfFameMember;
      }

      // Include only members who have active projects on Best of JS
      // or a custom "bio" (used to describe book authors and speakers for example)
      function filterMember(member: BestOfJS.HallOfFameMember) {
        return (
          member.followers > 100 && (member.projects.length > 0 || member.bio)
        );
      }

      const members = heroes.map(populateMemberProjects).filter(filterMember);
      return { members };
    },
  };
}

function fetchHallOfFameData() {
  const url = FETCH_ALL_PROJECTS_URL + `/hof.json`;
  console.log(`Fetching Hall of Fame data from ${url}`);
  return fetch(url).then((res) => res.json()) as Promise<{
    heroes: BestOfJS.RawHallOfFameMember[];
  }>;
}
