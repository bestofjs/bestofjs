# Tagging documentation

Best of JS stores curated project tags in the database. Use this directory to
understand the tagging model and review taxonomy changes:

- Read [CONTEXT.md](./CONTEXT.md) for the domain terminology used in code,
  documentation, and proposals.
- Read [conventions.md](./conventions.md) before assigning facets or proposing
  parent relationships.
- Read [decisions.md](./decisions.md) for non-obvious accepted and rejected
  decisions and their rationale.
- Review [facet-proposal.md](./facet-proposal.md) for the complete initial facet
  proposal and its unresolved classifications.
- Read [domains/ai.md](./domains/ai.md) when classifying AI-related projects.
- Use `catalog.json` as generated evidence of the curated catalog. Generate it
  with `pnpm cli tagging export-catalog`. The database remains the source of
  truth; never edit the catalog manually.
