/** biome-ignore-all lint/suspicious/noExplicitAny: to handle Drizzle columns names, we needed some `any` */
import { type AnyColumn, asc, count, desc, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import { db, schema } from "../index";

export async function getTotalNumberOfRows(
  table: PgTable,
  where?: SQL<unknown>,
) {
  const results = await db.select({ count: count() }).from(table).where(where);
  return results[0].count;
}

export function getSortQuery(
  table: PgTable,
  sort: { id: string; desc: boolean }[] = [],
  defaultSort?: SQL<unknown>[],
) {
  return sort.length > 0
    ? sort.map((item) => {
        const column = getColumn(table, item.id);
        return item.desc ? desc(column) : asc(column);
      })
    : (defaultSort ?? [desc(getColumn(table, "createdAt"))]);
}

export function getColumn(table: PgTable, column: string): AnyColumn {
  // TODO fix me, the `stars column nbelong to the repo table, not the projects table
  if (column === "stars") {
    return schema.repos.stars;
  }
  const candidate = (table as any)[column];
  if (isDrizzleColumn(candidate) && candidate.table === table) {
    return candidate;
  }
  throw new Error(`Invalid column "${column}" for the provided table`);
}

function isDrizzleColumn(value: unknown): value is AnyColumn {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in (value as any) &&
    "table" in (value as any)
  );
}
