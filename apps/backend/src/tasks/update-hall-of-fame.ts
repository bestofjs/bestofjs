import { eq } from "drizzle-orm";

import { createGitHubClient } from "@repo/api/github";
import { schema } from "@repo/db";
import { HallOfFameMember } from "@/iteration-helpers";
import { Task } from "@/task-runner";

export const updateHallOfFameTask: Task = {
  name: "update-hall-of-fame",
  description:
    "Update Hall of Fame members status based on their projects and bio",
  run: async ({ processHallOfFameMembers, dryRun, logger, db }) => {
    return await processHallOfFameMembers(async (member) => {
      let updated = false;
      const client = createGitHubClient();

      const isActive = (project: HallOfFameMember["relatedProjects"][number]) =>
        project.status !== "deprecated";

      const getStatus = () => {
        const allProjects = [
          ...member.relatedProjects,
          ...member.ownedProjects,
        ];
        const hasActiveProjects = allProjects.filter(isActive).length > 0;

        if (!member.bio && !hasActiveProjects) {
          return "inactive";
        }

        return "active";
      };

      const status = getStatus();
      const data = await client.fetchUserInfo(member.username);

      const followersHaveChanged = data.followers !== member.followers;
      const statusHasChanged = status !== member.status;
      const shouldBeUpdated = followersHaveChanged || statusHasChanged;

      if (shouldBeUpdated) {
        logger.debug(
          `Update followers count for ${member.username}: ${member.followers} -> ${data.followers}`
        );
        if (!dryRun) {
          await db
            .update(schema.hallOfFame)
            .set({
              status,
              followers: data.followers,
            })
            .where(eq(schema.hallOfFame.username, member.username));

          updated = true;
        }
      } else {
        logger.debug(`No update needed for ${member.username}`);
      }

      return {
        meta: { processed: true, shouldBeUpdated, updated },
        data: null,
      };
    });
  },
};
