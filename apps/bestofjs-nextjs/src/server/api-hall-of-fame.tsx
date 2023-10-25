import uniqBy from "lodash/uniqBy";
import mingo from "mingo";

import { env } from "@/env.mjs";

import { APIContext } from "./api-utils";

type FindOptions = {
  limit?: number;
  query?: string;
};

export function createHallOfFameAPI(context: APIContext) {
  return {
    async findMembers(options?: FindOptions) {
      const { limit = 1000, query } = options || {};
      const { populate, projectCollection, projectsBySlug } =
        await context.getData();

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

      const { members } = await fetchHallOfFameData();
      const filteredMembers = query
        ? filterMembersByTextQuery(members, query)
        : members;
      const populatedMembers = filteredMembers
        .map(populateMemberProjects)
        .filter(filterMember)
        .slice(0, limit);
      return { members: populatedMembers };
    },
  };
}

async function fetchHallOfFameData() {
  const url = env.STATIC_API_ROOT_URL + `/hof.json`;
  console.log(`Fetching Hall of Fame data from ${url}`);
  const { heroes } = await fetch(url, {
    next: {
      revalidate: 60 * 60 * 24, // try to invalidate data every 24h
      tags: ["hall-of-fame"],
    },
  }).then((res) => res.json());
  return { members: heroes as BestOfJS.RawHallOfFameMember[] };
}

function filterMembersByTextQuery(
  members: BestOfJS.RawHallOfFameMember[],
  query: string
) {
  const includeRegExp = new RegExp(query, "i");
  const criteria = {
    $or: [
      { name: { $regex: includeRegExp } },
      { username: { $regex: includeRegExp } },
    ],
  };
  return mingo.find(members, criteria).all() as BestOfJS.RawHallOfFameMember[];
}
