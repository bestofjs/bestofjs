import React from 'react'
import { useSelector } from 'react-redux'

import { getAllTagsSortedBy } from '../selectors/tag-selectors'
import { PaginatedTagList } from '../components/tags/paginated-tag-list'
import { TagIcon } from '../components/core/icons'
import { MainContent, PageTitle } from '../components/core'
import {
  PaginationProvider,
  paginateItemList
} from '../components/core/pagination'
import { useParseURL } from '../helpers/url'

const TagsPage = () => {
  const { sort, page } = useParseURL({ sort: 'project-count' })
  const tags = useSelector(getAllTagsSortedBy(sort))
  const total = tags.length
  const limit = 20
  const paginatedTags = paginateItemList(tags, page, { limit })

  return (
    <MainContent>
      <PaginationProvider total={total} currentPageNumber={page} limit={limit}>
        <PageTitle icon={<TagIcon size={32} />}>All Tags</PageTitle>
        <PaginatedTagList
          tags={paginatedTags}
          page={page}
          total={total}
          limit={limit}
          sortOptionId={sort}
        />
      </PaginationProvider>
    </MainContent>
  )
}

export default TagsPage
