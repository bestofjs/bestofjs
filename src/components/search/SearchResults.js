import React, { useContext } from 'react'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import searchForProjects from '../../selectors/search'
import { allProjects, sortBy, getFullProject } from '../../selectors'
import { SearchContext } from './SearchProvider'
import { paginateItemList } from '../common/pagination/helpers'
import { PaginationProvider } from '../common/pagination/provider'
import { ProjectPaginatedList } from './project-paginated-list'
import MainContent from '../common/MainContent'

export const SearchResultsContainer = () => {
  const { selectedTags, query, sortOption, page } = useContext(SearchContext)
  const projects = useSelector(allProjects)
  const tags = useSelector(state => state.entities.tags)
  const auth = useSelector(state => state.auth)

  const { results: foundProjects, total } = findProjects(projects, tags, auth, {
    tags: selectedTags,
    query,
    page,
    selector: sortOption.selector
  })

  return (
    <MainContent>
      <PaginationProvider total={total} currentPageNumber={page} limit={10}>
        <ProjectPaginatedList
          projects={foundProjects}
          query={query}
          page={page}
          total={total}
          sortOption={sortOption}
          showBookmark={false}
        >
          <h3 className="no-card-container" style={{ marginBottom: '0.25rem' }}>
            Search results: {showCount(total, 'project')} found.
          </h3>
        </ProjectPaginatedList>
      </PaginationProvider>
    </MainContent>
  )
}

function findProjects(
  projects,
  tagsById,
  auth,
  { tags, query, page = 1, selector }
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

  const paginatedProjects = paginateItemList(sortedProjects, page)

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
