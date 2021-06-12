import React from 'react'
import { GoBookmark } from 'react-icons/go'

import { useSelector } from 'containers/project-data-container'
import { useSearch } from 'components/search/search-container'
import {
  paginateItemList,
  PaginationContainer
} from 'components/core/pagination'
import { ProjectPaginatedList } from 'components/search/project-paginated-list'
import { EmptyContent, MainContent, Title } from 'components/core'
import { getBookmarksSortedBy } from 'selectors'
import { AuthContainer } from 'containers/auth-container'

const BookmarksPage = () => {
  const { page, sortOption } = useSearch({ defaultSortOptionId: 'bookmark' })
  const { isLoggedIn } = AuthContainer.useContainer()
  const projects = useSelector(getBookmarksSortedBy(sortOption.id))

  const total = projects.length
  const limit = 10
  const paginatedProjects = paginateItemList(projects, page, { limit })

  return (
    <MainContent>
      {total === 0 && <EmptyList isLoggedin={isLoggedIn} />}
      {total > 0 && (
        <PaginationContainer.Provider
          initialState={{ total, currentPageNumber: page, limit }}
        >
          <Title
            icon={<GoBookmark size={32} />}
            extra={total === 1 ? '(one project)' : `(${total} projects)`}
          >
            Bookmarks
          </Title>
          <ProjectPaginatedList
            projects={paginatedProjects}
            page={page}
            total={total}
            limit={limit}
            sortOption={sortOption}
          />
        </PaginationContainer.Provider>
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
