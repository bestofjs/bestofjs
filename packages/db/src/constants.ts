export const PROJECT_STATUSES = [
  "active",
  "featured",
  "promoted",
  "deprecated",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TAGS_EXCLUDED_FROM_RANKINGS = [
  "meta",
  "learning",
  "wildcard",
  "ai-methodology",
];
