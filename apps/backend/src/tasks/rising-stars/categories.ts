import path from "node:path";
import fs from "fs-extra";
import { z } from "zod";

// TODO share the scheme with javascript-risingstars app
const schema = z.object({
  key: z.string(),
  limit: z.number().optional(),
  count: z.number().optional(),
  tags: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  excludedTags: z.array(z.string()).optional(),
  availableComments: z.array(z.string()).optional(),
  guest: z.string().optional(),
  disabled: z.boolean().optional(),
});

export type Category = z.infer<typeof schema>;

export async function fetchCategories(year: number) {
  const filepath = path.resolve(
    process.cwd(),
    "..",
    "javascript-risingstars",
    "src/content/categories",
    `${year}.json`
  );
  const rawData = await fs.readJSON(filepath);
  return z.array(schema).parse(rawData);
}
