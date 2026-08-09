import { eq } from "drizzle-orm";

import { DB } from "../src/index";
import * as schema from "../src/schema";
import { fetchHeroes, getDateFromMongoValue, Hero } from "./read-data";
import { runDbScript } from "./run-db-script";

const LIMIT = 1000;

type HallOfFameRecord = typeof schema.hallOfFame.$inferInsert;

runDbScript(async (db: DB, spinner) => {
  const heroes = await fetchHeroes();
  let projectCount = 0;

  spinner.message(`Importing ${heroes.length} heroes`);

  for await (const hero of heroes.slice(0, LIMIT)) {
    await importHallOfFameRecord(hero);

    await importHallOfFameProjects(hero);
  }

  async function importHallOfFameRecord(hero: Hero) {
    const record: HallOfFameRecord = {
      username: hero.github.login,
      name: hero.name || hero.github.name,
      bio: hero.short_bio,
      twitter: hero.github.twitter,
      homepage: hero.url || hero.github.homepage,
      followers: hero.github.followers,
      avatar: hero.github.avatar_url,
      npmUsername: hero.npm?.username || null,
      npmPackageCount: hero.npm?.count || null,
      createdAt: getDateFromMongoValue(hero.createdAt) || undefined,
      updatedAt: getDateFromMongoValue(hero.updatedAt),
    };
    await db.insert(schema.hallOfFame).values(record);
  }

  async function importHallOfFameProjects(hero: Hero) {
    for (const projectMongoId of hero.projects) {
      const projectId = projectMongoId.$oid;
      if (
        await db.query.projects.findFirst({
          where: eq(schema.projects.id, projectId),
        })
      ) {
        await db
          .insert(schema.hallOfFameToProjects)
          .values({ username: hero.github.login, projectId });
        projectCount++;
      } else {
        console.log("Project not found", projectId);
      }
    }
  }

  spinner.stop(
    `Done, ${heroes.length} Hall of Fame members imported, ${projectCount} projects linked`
  );
});
