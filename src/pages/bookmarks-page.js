import React from 'react'
import { useSelector } from 'react-redux'

import { useSearch } from '../components/search/SearchProvider'
import {
  PaginationProvider,
  paginateItemList
} from '../components/core/pagination'
import { ProjectPaginatedList } from '../components/search/project-paginated-list'
import { PageTitle, EmptyContent, MainContent } from '../components/core'
import { BookmarkIcon } from '../components/core/icons'
import { getBookmarksSortedBy } from '../selectors'
import { useUser } from '../api/hooks'

const BookmarksPage = () => {
  const { page, sortOption } = useSearch({ defaultSortOptionId: 'bookmark' })
  const { isLoggedIn } = useUser()
  const projects = useSelector(getBookmarksSortedBy(sortOption.id))

  const total = projects.length
  const limit = 10
  const paginatedProjects = paginateItemList(projects, page, { limit })

  return (
    <MainContent>
      {total === 0 && <EmptyList isLoggedin={isLoggedIn} />}
      {total > 0 && (
        <PaginationProvider
          total={total}
          currentPageNumber={page}
          limit={limit}
        >
          <PageTitle
            icon={<BookmarkIcon size={32} />}
            extra={total === 1 ? '(one project)' : `(${total} projects)`}
          >
            Bookmarks
          </PageTitle>
          <ProjectPaginatedList
            projects={paginatedProjects}
            page={page}
            total={total}
            limit={limit}
            sortOption={sortOption}
          />
        </PaginationProvider>
      )}
    </MainContent>
  )
}

export default BookmarksPage

const EmptyList = ({ isLoggedin }) => (
  <EmptyContent>
    {isLoggedin ? (
      <div>
        <p>{"You don't have bookmarked any project."}</p>
        <p>
          Add projects you want to follow by using the `ADD BOOKMARK` button.
        </p>
      </div>
    ) : (
      <span>Please sign-in to access this feature!</span>
    )}
  </EmptyContent>
)
