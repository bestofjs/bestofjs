import React, { useContext } from 'react'
import { useSelector } from 'react-redux'

import MainContent from '../components/common/MainContent'
import { SearchContext } from '../components/search/SearchProvider'
import {
  PaginationProvider,
  paginateItemList
} from '../components/common/pagination'
import { ProjectPaginatedList } from '../components/search/project-paginated-list'
// import Octicon, { Bookmark } from '@primer/octicons-react'
import { getBookmarksSortedBy } from '../selectors'
import { useUser } from '../api/hooks'

const BookmarksPage = () => {
  const { page, sortOption } = useContext(SearchContext)
  const { isLoggedIn } = useUser()
  const projects = useSelector(getBookmarksSortedBy(sortOption.id))

  const total = projects.length
  const limit = 5
  const paginatedProjects = paginateItemList(projects, page, { limit })

  return (
    <MainContent>
      <h3 className="no-card-container">
        <span
          className={'icon mega-octicon octicon-bookmark'}
          style={{ marginRight: '.25rem' }}
        />{' '}
        Bookmarked projects
        <Counter count={total} />
      </h3>
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
            {/* <h3
              className="no-card-container"
              style={{ marginBottom: '0.25rem' }}
            >
              <Octicon>
                <Bookmark />
              </Octicon>{' '}
              Bookmarks
            </h3> */}
          </ProjectPaginatedList>
        </PaginationProvider>
      )}
    </MainContent>
  )
}

export default BookmarksPage

const Counter = ({ count }) => {
  if (count === 0) return null
  return (
    <span
      className="counter"
      style={{ color: '#999', fontSize: '1rem', marginLeft: '.25rem' }}
    >
      {count === 1 ? ' (one project)' : ` (${count} projects)`}
    </span>
  )
}

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
