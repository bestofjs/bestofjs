import type { ProjectLabelKey } from "@repo/db/project-trends";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LabelConfig = {
  text: string;
  /** Native `title`: states the underlying fact, with no JS shipped. */
  title: string;
  /** Tailwind's default palette — no theme tokens needed, both modes covered. */
  className: string;
};

/**
 * Display copy and colour for the key `getProjectLabel()` returns. Every label
 * is a caution, so they share a cool-to-red range: red for curated deprecation,
 * slate for neglect, sky for lost momentum.
 */
const LABELS: Record<ProjectLabelKey, LabelConfig> = {
  deprecated: {
    text: "deprecated",
    title: "This project is no longer maintained by its authors.",
    className:
      "border-red-300 bg-red-100 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  },
  inactive: {
    text: "inactive",
    title: "No commit for more than a year.",
    className:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  cold: {
    text: "cold",
    title: "Fewer than 50 new stars over the past year.",
    className:
      "border-sky-300 bg-sky-100 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
  },
};

export function ProjectLabel({
  label,
  className,
}: {
  label: ProjectLabelKey | null;
  className?: string;
}) {
  if (!label) return null;
  const config = LABELS[label];
  return (
    <Badge
      variant="outline"
      title={config.title}
      className={cn("shrink-0 whitespace-nowrap", config.className, className)}
    >
      {config.text}
    </Badge>
  );
}
