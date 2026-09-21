/** Dependency-free taxonomy definitions, safe in server and client modules. */
export const TAG_FACETS = [
  "ecosystem",
  "category",
  "capability",
  "property",
] as const;

export type TagFacet = (typeof TAG_FACETS)[number];

export type TaxonomyTag = {
  id: string;
  facet: TagFacet | null;
  parentTagId: string | null;
};

export type TagClosureRow = {
  descendantId: string;
  ancestorId: string;
  depth: number;
};

export function isTagFacet(value: unknown): value is TagFacet {
  return TAG_FACETS.some((facet) => facet === value);
}

/** A parent edge is subset inheritance, not similarity or co-occurrence. */
export function isValidEdge(
  childFacet: TagFacet | null,
  parentFacet: TagFacet | null,
) {
  if (!childFacet || !parentFacet) return false;
  if (childFacet === "ecosystem") return parentFacet === "ecosystem";
  if (childFacet === "category") {
    return parentFacet === "capability" || parentFacet === "property";
  }
  return false;
}

export function wouldCreateCycle(
  tags: Pick<TaxonomyTag, "id" | "parentTagId">[],
  childId: string,
  parentId: string | null,
) {
  if (parentId === null) return false;
  if (childId === parentId) return true;

  const parents = new Map(tags.map((tag) => [tag.id, tag.parentTagId]));
  const visited = new Set<string>();
  let currentId: string | null | undefined = parentId;
  while (currentId) {
    if (currentId === childId) return true;
    if (visited.has(currentId)) return true;
    visited.add(currentId);
    currentId = parents.get(currentId);
  }
  return false;
}

/** Validate the complete source tree and derive every self/ancestor path. */
export function buildTagClosure(tags: TaxonomyTag[]): TagClosureRow[] {
  const byId = new Map(tags.map((tag) => [tag.id, tag]));

  for (const tag of tags) {
    if (tag.facet !== null && !isTagFacet(tag.facet)) {
      throw new Error(`Invalid tag facet for ${tag.id}: ${String(tag.facet)}`);
    }
    if (!tag.parentTagId) continue;
    const parent = byId.get(tag.parentTagId);
    if (!parent) {
      throw new Error(
        `Tag ${tag.id} refers to missing parent ${tag.parentTagId}`,
      );
    }
    if (!isValidEdge(tag.facet, parent.facet)) {
      throw new Error(
        `Invalid taxonomy edge ${tag.id} (${tag.facet ?? "unfaceted"}) -> ${parent.id} (${parent.facet ?? "unfaceted"})`,
      );
    }
    if (wouldCreateCycle(tags, tag.id, tag.parentTagId)) {
      throw new Error(`Taxonomy cycle detected at tag ${tag.id}`);
    }
  }

  return tags.flatMap((tag) => {
    const rows: TagClosureRow[] = [];
    let current: TaxonomyTag | undefined = tag;
    let depth = 0;
    while (current) {
      rows.push({
        descendantId: tag.id,
        ancestorId: current.id,
        depth,
      });
      current = current.parentTagId ? byId.get(current.parentTagId) : undefined;
      depth += 1;
    }
    return rows;
  });
}

/** Expand direct codes upward, preserving direct-first and nearest-first order. */
export function expandUpward(
  directCodes: string[],
  parentByCode: ReadonlyMap<string, string | null>,
) {
  const result: string[] = [];
  const seen = new Set<string>();
  const append = (code: string) => {
    if (!seen.has(code)) {
      seen.add(code);
      result.push(code);
    }
  };

  for (const directCode of directCodes) append(directCode);
  for (const directCode of directCodes) {
    const path = new Set([directCode]);
    let parentCode = parentByCode.get(directCode);
    while (parentCode) {
      if (path.has(parentCode)) {
        throw new Error(
          `Taxonomy cycle detected while expanding ${directCode}`,
        );
      }
      path.add(parentCode);
      append(parentCode);
      parentCode = parentByCode.get(parentCode);
    }
  }
  return result;
}
