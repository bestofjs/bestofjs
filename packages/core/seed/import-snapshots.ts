/**
 * To check the result:
 * SELECT year, count(repo_id) FROM "snapshots" group by year order by year
 */
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { DB } from "../src/index";
import * as schema from "../src/schema";
import {
  fetchSnapshotsByYear,
  getDateFromMongoValue,
  MongoSnapshot,
} from "./read-data";
import { runDbScript } from "./run-db-script";

const yearParam = Bun.argv.at(2);
if (!yearParam) throw new Error("Missing year parameter");
const year = parseInt(yearParam, 10);

const CHECK_EXISTING_DATA = true;

runDbScript(async (db: DB, spinner) => {
  const snapshots = await fetchSnapshotsByYear(year);

  let i = 0;
  let imported = 0;
  let skipped = 0;
  for (const snapshot of snapshots) {
    i++;
    spinner.message(`Importing snapshot ${i}/${snapshots.length}`);

    if (!(await shouldBeImported(snapshot))) {
      skipped++;
    } else {
      const parsedRecord = snapshotSchema.parse(snapshot);
      const months = cleanUpMonths(parsedRecord.months);

      try {
        await db.insert(schema.snapshots).values({
          repoId: snapshot.project.$oid,
          createdAt: getDateFromMongoValue(snapshot.createdAt) || new Date(),
          updatedAt: getDateFromMongoValue(snapshot.updatedAt),
          year: snapshot.year,
          months,
        });
        imported++;
      } catch (error) {
        throw new Error(
          `Unable to process snapshot ${snapshot.project.$oid} ${
            snapshot.year
          } ${(error as Error).message}`
        );
      }
    }
  }

  spinner.stop(`Done, ${imported} snapshots created, ${skipped} skipped`);

  async function shouldBeImported(snapshot: MongoSnapshot) {
    if (!CHECK_EXISTING_DATA) return true;
    return (
      (await checkProjectExists(snapshot.project.$oid)) &&
      !(await checkSnapshotAlreadyImported(snapshot))
    );
  }

  async function checkProjectExists(projectId: string) {
    const project = await db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
    });
    return Boolean(project);
  }

  async function checkSnapshotAlreadyImported(snapshot: MongoSnapshot) {
    const existingSnapshot = await db.query.snapshots.findFirst({
      where: and(
        eq(schema.snapshots.year, snapshot.year),
        eq(schema.snapshots.repoId, snapshot.project.$oid)
      ),
    });
    return Boolean(existingSnapshot);
  }
});

function cleanUpMonths(months: z.infer<typeof MonthSchema>[]) {
  return months.map((month) => ({
    month: month.month,
    snapshots: month.snapshots.filter((snaphot) => snaphot.stars !== null),
  }));
}

const MonthSchema = z.object({
  month: z.number(),
  snapshots: z.array(
    z.object({
      day: z.number(),
      stars: z.number().nullable(),
    })
  ),
});

const snapshotSchema = z.object({
  year: z.number(),
  months: z.array(MonthSchema),
});
