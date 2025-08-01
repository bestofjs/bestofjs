import { createGitHubClient } from "@repo/api/github";
import { schema } from "@repo/db";
import { eq } from "@repo/db/drizzle";

import type { HallOfFameMember } from "@/iteration-helpers";
import { createTask } from "@/task-runner";

export const updateHallOfFameTask = createTask({
  name: "update-hall-of-fame",
  description:
    "Update Hall of Fame members follower status based on their projects and bio",
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
      const isArchived = member.status === "archived";
      const statusHasChanged = status !== member.status;
      const shouldBeUpdated = followersHaveChanged || statusHasChanged;

      if (isArchived) {
        logger.debug(`Member ${member.username} is archived, skipping`);
        return { meta: { isArchived: true }, data: null };
      }

      if (shouldBeUpdated) {
        logger.debug(
          `Update followers count for ${member.username}: ${member.followers} -> ${data.followers}`,
        );
        if (!dryRun) {
          await db
            .update(schema.hallOfFame)
            .set({
              avatar: data.avatar_url,
              followers: data.followers,
              status,
              updatedAt: new Date(),
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
});
