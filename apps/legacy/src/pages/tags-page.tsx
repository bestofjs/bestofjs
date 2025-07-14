import { MainContent, PageHeader } from "components/core";
import { TagIcon } from "components/core/icons";
import {
  PaginationContainer,
  paginateItemList,
} from "components/core/pagination";
import { PaginatedTagList } from "components/tags/paginated-tag-list";
import { useSelector } from "containers/project-data-container";
import { useParseURL } from "helpers/url";
import { getAllTagsSortedBy } from "selectors";

const TagsPage = () => {
  const { sort, page } = useParseURL({ sort: "project-count" });
  const tags = useSelector(getAllTagsSortedBy(sort));
  const total = tags.length;
  const limit = 20;
  const paginatedTags = paginateItemList(tags, page, { limit });

  return (
    <MainContent>
      <PaginationContainer.Provider
        initialState={{ total, currentPageNumber: page, limit }}
      >
        <PageHeader title="All Tags" icon={<TagIcon size={32} />} />
        <PaginatedTagList
          tags={paginatedTags}
          total={total}
          sortOptionId={sort}
        />
      </PaginationContainer.Provider>
    </MainContent>
  );
};

export default TagsPage;
