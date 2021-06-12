import React from 'react'

import { useSelector } from 'containers/project-data-container'
import { getAllTagsSortedBy } from 'selectors'
import { PaginatedTagList } from 'components/tags/paginated-tag-list'
import { TagIcon } from 'components/core/icons'
import { MainContent, Title } from 'components/core'
import {
  paginateItemList,
  PaginationContainer
} from 'components/core/pagination'
import { useParseURL } from 'helpers/url'

const TagsPage = () => {
  const { sort, page } = useParseURL({ sort: 'project-count' })
  const tags = useSelector(getAllTagsSortedBy(sort))
  const total = tags.length
  const limit = 20
  const paginatedTags = paginateItemList(tags, page, { limit })

  return (
    <MainContent>
      <PaginationContainer.Provider
        initialState={{ total, currentPageNumber: page, limit }}
      >
        <Title icon={<TagIcon size={32} />}>All Tags</Title>
        <PaginatedTagList
          tags={paginatedTags}
          page={page}
          total={total}
          limit={limit}
          sortOptionId={sort}
        />
      </PaginationContainer.Provider>
    </MainContent>
  )
}

export default TagsPage
