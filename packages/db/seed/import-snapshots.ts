import { and, eq } from "drizzle-orm";

import {
  MongoSnapshot,
  fetchSnapshotsByYear,
  getDateFromMongoValue,
} from "./read-data";
import { DB } from "../src/index";
import * as schema from "../src/schema";
import { runDbScript } from "./run-db-script";

const yearParam = Bun.argv.at(2);
if (!yearParam) throw new Error("Missing year parameter");
const year = parseInt(yearParam, 10);

const CHECK_EXISTING_DATA = false;

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
      try {
        await db.insert(schema.snapshots).values({
          repoId: snapshot.project.$oid,
          createdAt: getDateFromMongoValue(snapshot.createdAt) || new Date(),
          updatedAt: getDateFromMongoValue(snapshot.updatedAt),
          year: snapshot.year,
          months: snapshot.months,
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

  spinner.stop(`${imported} snapshots created, ${skipped} skipped`);

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
