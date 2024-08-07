import { fetchTags, getDateFromMongoValue } from "./read-data";
import { DB } from "../src/index";
import * as schema from "../src/schema";
import { runDbScript } from "./run-db-script";

const LIMIT = 1000;

runDbScript(async (db: DB, spinner) => {
  const tags = await fetchTags();

  spinner.message(`Importing ${tags.length} tags`);

  const records = tags.slice(0, LIMIT).map((tag) => ({
    id: tag._id.$oid,
    name: tag.name,
    code: tag.code,
    description: tag.description,
    aliases: tag.aliases,
    createdAt: getDateFromMongoValue(tag.createdAt) as Date,
    updatedAt: getDateFromMongoValue(tag.updatedAt),
  }));

  await db.insert(schema.tags).values(records);

  spinner.stop(`Done, ${records.length} tags imported`);
});
