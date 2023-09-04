import { APIContext, FETCH_ALL_PROJECTS_URL } from "./api-utils";

export function createHallOfFameAPI(context: APIContext) {
  return {
    async findMembers() {
      const { populate, projectsBySlug } = await context.getData();
      const { heroes } = await fetchHallOfFameData();

      const populateMemberProjects = (member: BestOfJS.RawHallOfFameMember) => {
        const projects: BestOfJS.Project[] = member.projects
          .map((projectSlug) => projectsBySlug[projectSlug])
          .filter(Boolean) // needed as some members are linked to deprecated projects. TODO fix Hall of fame data?
          .map(populate);
        return {
          ...member,
          projects,
        } as BestOfJS.HallOfFameMember;
      };

      // Include only members who have active projects on Best of JS
      // or a custom "bio" (used to describe book authors and speakers for example)
      const filterMember = (member: BestOfJS.HallOfFameMember) => {
        return (
          member.followers > 100 && (member.projects.length > 0 || member.bio)
        );
      };

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
