import React, { useContext } from 'react'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import searchForProjects from '../../selectors/search'
import { allProjects, sortBy, getFullProject } from '../../selectors'
import { PaginationProvider, paginateItemList } from '../common/pagination'
import { PageTitle } from '../core'
import MainContent from '../common/MainContent'
import { SearchContext } from './SearchProvider'
import { ProjectPaginatedList } from './project-paginated-list'

export const SearchResultsContainer = () => {
  const { selectedTags, query, sortOption, page } = useContext(SearchContext)
  const limit = 10

  const projects = useSelector(allProjects)
  const tags = useSelector(state => state.entities.tags)
  const auth = useSelector(state => state.auth)

  const { results: foundProjects, total } = findProjects(projects, tags, auth, {
    tags: selectedTags,
    query,
    page,
    selector: sortOption.selector,
    limit
  })

  const isListFiltered = query !== '' || selectedTags.length > 0

  return (
    <MainContent>
      <PaginationProvider total={total} currentPageNumber={page} limit={limit}>
        <ProjectPaginatedList
          projects={foundProjects}
          query={query}
          page={page}
          total={total}
          limit={limit}
          sortOption={sortOption}
          showBookmark={false}
        >
          <PageTitle>
            {isListFiltered ? (
              <>Search results: {showCount(total, 'project')} found</>
            ) : (
              <>All projects</>
            )}
          </PageTitle>
        </ProjectPaginatedList>
      </PaginationProvider>
    </MainContent>
  )
}

function findProjects(
  projects,
  tagsById,
  auth,
  { tags, query, page = 1, selector, limit }
) {
  console.info('Find', tags, query, page)
  const filterByTag = project =>
    tags.every(tagId => project.tags.includes(tagId))

  const filteredProjects = projects.filter(project => {
    if (tags.length > 0) {
      if (!filterByTag(project)) return false
    }
    return true
  })

  const foundProjects = query
    ? searchForProjects(filteredProjects, query)
    : filteredProjects

  const sortedProjects = sortBy(foundProjects, selector)

  const paginatedProjects = paginateItemList(sortedProjects, page, { limit })

  const results = paginatedProjects.map(getFullProject(tagsById, auth))

  return {
    results,
    total: foundProjects.length
  }
}

const showCount = (total, text) => {
  if (total === 0) return `no ${text}`
  return `${total} ${text}${total > 1 ? 's' : ''}`
}
