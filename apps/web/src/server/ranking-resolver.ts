export type RankingEntry = {
  slug: string;
  full_name: string;
  delta: number;
};

/**
 * Restores the archive's ranking order after the set-based DB lookup. Entries
 * omitted only by deployment tag filtering are skipped silently; the core
 * query reports true database misses separately in `missingSlugs`.
 */
export function resolveRankingProjects<Project extends { slug: string }>({
  entries,
  foundProjects,
  limit,
  missingSlugs,
}: {
  entries: RankingEntry[];
  foundProjects: Project[];
  limit: number;
  missingSlugs: string[];
}) {
  const projectsBySlug = new Map(
    foundProjects.map((project) => [project.slug, project]),
  );
  const missingSlugSet = new Set(missingSlugs);
  const missingEntries = entries.filter((entry) =>
    missingSlugSet.has(entry.slug),
  );
  const projects = entries
    .flatMap((entry) => {
      const project = projectsBySlug.get(entry.slug);
      return project ? [{ ...project, score: entry.delta }] : [];
    })
    .slice(0, limit);

  return { projects, missingEntries };
}
