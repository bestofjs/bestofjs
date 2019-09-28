import React, { useContext } from 'react'
import { useSelector } from 'react-redux'

import MainContent from '../components/common/MainContent'
import { SearchContext } from '../components/search/SearchProvider'
import {
  PaginationProvider,
  paginateItemList
} from '../components/common/pagination'
import { ProjectPaginatedList } from '../components/search/project-paginated-list'
import Octicon, { Bookmark } from '@primer/octicons-react'
import { getBookmarksSortedBy } from '../selectors'
import { useUser } from '../api/hooks'
import { PageTitle } from '../components/core'

const BookmarksPage = () => {
  const { page, sortOption } = useContext(SearchContext)
  const { isLoggedIn } = useUser()
  const projects = useSelector(getBookmarksSortedBy(sortOption.id))

  const total = projects.length
  const limit = 5
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
          <ProjectPaginatedList
            projects={paginatedProjects}
            page={page}
            total={total}
            limit={limit}
            sortOption={sortOption}
            showBookmark={true}
          >
            <PageTitle
              icon={
                <Octicon size={32}>
                  <Bookmark />
                </Octicon>
              }
              extra={total === 1 ? '(one project)' : `(${total} projects)`}
            >
              Bookmarks
            </PageTitle>
          </ProjectPaginatedList>
        </PaginationProvider>
      )}
    </MainContent>
  )
}

export default BookmarksPage

const EmptyList = ({ isLoggedin }) => (
  <div style={{ border: '2px dashed #fa9e59', padding: '2rem' }}>
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
  </div>
)
