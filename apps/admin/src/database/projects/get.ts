import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

import { getDatabase } from "@/database";
import * as schema from "@/database/schema";

export async function getProjectBySlug(slug: string) {
  const db = getDatabase();
  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.slug, slug),
    with: {
      repo: {
        // columns: {
        //   id: true,
        //   full_name: true,
        //   owner_id: true,
        //   stars: true,
        // },
        with: {
          snapshots: {
            columns: {
              year: true,
              months: true,
            },
          },
        },
      },
      projectsToTags: {
        with: {
          tag: {
            // columns: {
            //   code: true,
            //   name: true,
            // },
          },
        },
      },
      packages: {
        columns: {
          name: true,
          version: true,
          dependencies: true,
        },
      },
    },
  });
  if (project) {
    invariant(project?.repo);
  }
  return project;
}
