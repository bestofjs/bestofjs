import type { TagFilterState } from "@/components/project-list/project-table";
import type { PageSearchUrlBuilder } from "@/lib/page-search-state";

import { ProjectTag } from "./project-tag";

type Props<T extends TagFilterState = TagFilterState> = {
  tags: BestOfJS.RawTag[];
  appendTag?: boolean;
  buildPageURL?: PageSearchUrlBuilder<T>;
};

export function ProjectTagGroup<T extends TagFilterState = TagFilterState>({
  tags,
  appendTag,
  buildPageURL,
}: Props<T>) {
  return (
    <div className="-m-1 flex flex-wrap">
      {tags.map((tag) => {
        const url = buildPageURL
          ? buildPageURL(
              (state) => ({
                ...state,
                tags: appendTag ? [...state.tags, tag.code] : [tag.code],
                page: 1,
              }),
              "/projects",
            )
          : `/projects?tags=${tag.code}`;
        return (
          <div key={tag.code} className="m-1">
            <ProjectTag tag={tag} url={url} />
          </div>
        );
      })}
    </div>
  );
}
