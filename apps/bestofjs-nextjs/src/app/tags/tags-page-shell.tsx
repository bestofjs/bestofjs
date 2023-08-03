import { TagIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";

/**
 *
 * Page shell shared between normal page and loading state
 */
export function TagsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeading title="All Tags" icon={<TagIcon size={32} />} />
      {children}
    </>
  );
}
