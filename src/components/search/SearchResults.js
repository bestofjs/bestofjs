import React, { useContext } from 'react'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import useReactRouter from 'use-react-router'
import { parse, stringify } from 'qs'

import ProjectTable from '../project-list/ProjectTable'
import searchForProjects from '../../selectors/search'
import { allProjects, sortBy } from '../../selectors'
import { SearchContext } from './SearchProvider'
import PaginationControls from '../common/pagination/PaginationControls'
import { paginateItemList } from '../common/pagination/helpers'
import {
  PaginationProvider,
  PaginationContext
} from '../common/pagination/provider'
import { SortOrderPicker, sortOrderOptions } from './sort-order'

export const SearchResultsContainer = ({
  match: {
    params: { period }
  }
}) => {
  const { selectedTags, query, page } = useContext(SearchContext)
  const projects = useSelector(allProjects)

  const sortOption =
    sortOrderOptions.find(item => item.id === period) || sortOrderOptions[0]
  const { selector } = sortOption

  const { results: foundProjects, total } = findProjects(projects, {
    tags: selectedTags,
    query,
    page,
    selector
  })

  return (
    <PaginationProvider total={total} currentPageNumber={page} limit={10}>
      <SearchResults
        projects={foundProjects}
        query={query}
        page={page}
        total={total}
        sortOption={sortOption}
      />
    </PaginationProvider>
  )
}

export const SearchResults = ({ projects, query, page, total, sortOption }) => {
  const { from, to, pageNumbers } = useContext(PaginationContext)
  const { location, history } = useReactRouter()

  const handleChange = id => {
    console.log({ id })
    const pathname = id === 'total' ? '/projects' : `/projects/trending/${id}`
    history.push({ ...resetPage(location), pathname })
  }

  return (
    <div>
      <div className="container">
        <br />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '0 0 50%' }}>
            <h3
              className="no-card-container"
              style={{ marginBottom: '0.25rem' }}
            >
              Search results: {showCount(total, 'project')} found.
            </h3>
          </div>
          <div style={{ flex: '0 0 50%' }}>
            <SortOrderPicker onChange={handleChange} value={sortOption.id} />
          </div>
        </div>
        {pageNumbers.length > 0 && (
          <p style={{ color: '#788080' }}>
            Showing{' '}
            {from === to ? (
              `#${from}`
            ) : (
              <>
                from #{from} to #{to}
              </>
            )}
          </p>
        )}
        <br />
        <ProjectTable
          projects={projects}
          showStars={false}
          from={from}
          sortOption={sortOption}
        />
        <PaginationControls total={total} currentPage={page} />
      </div>
    </div>
  )
}
SearchResults.propTypes = {}

export default SearchResults

function findProjects(projects, { tags, query, page = 1, selector }) {
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

  return {
    results: paginateItemList(sortedProjects, page),
    total: foundProjects.length
  }
}

const showCount = (total, text) => {
  if (total === 0) return `no ${text}`
  return `${total} ${text}${total > 1 ? 's' : ''}`
}

function resetPage(location) {
  const { search } = location
  const params = parse(search, { ignoreQueryPrefix: true })
  delete params.page
  const result = { ...location, search: stringify(params, { encode: false }) }
  console.log({ result })
  return result
}
