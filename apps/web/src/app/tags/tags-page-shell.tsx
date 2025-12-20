import { Suspense } from "react";

import { TagIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";

import { TagListLoading } from "./loading-state";

/**
 *
 * Page shell shared between normal page and loading state
 */
export function TagsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeading title="All Tags" icon={<TagIcon className="size-8" />} />
      <Suspense fallback={<TagListLoading />}>{children}</Suspense>
    </>
  );
}
