import { TagListLoading } from "./loading-state";
import { TagsPageShell } from "./tags-page-shell";

export default function LoadingTags() {
  return (
    <TagsPageShell>
      <TagListLoading />
    </TagsPageShell>
  );
}
