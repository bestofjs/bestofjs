import React from 'react'
import { withRouter } from 'react-router-dom'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import searchForProjects from '../../selectors/search'
import {
  allProjects,
  sortBy,
  getFullProject,
  getTagsById
} from '../../selectors'
import { PaginationProvider, paginateItemList } from '../common/pagination'
import Spinner from '../common/Spinner'
import { Button, PageTitle, EmptyContent } from '../core'
import MainContent from '../common/MainContent'
import { ProjectPaginatedList } from './project-paginated-list'
import TagLabelGroup from '../tags/TagLabelGroup'
import { useSearch } from './SearchProvider'
import { updateLocation } from './search-utils'

export const SearchResultsContainer = () => {
  const { selectedTags, query, sortOption, page } = useSearch({
    defaultSortOptionId: 'total'
  })
  const limit = 10

  const projects = useSelector(allProjects)
  const tags = useSelector(state => state.entities.tags)
  const auth = useSelector(state => state.auth)

  if (projects.length === 0) return <Spinner />

  const { results: foundProjects, total } = findProjects(projects, tags, auth, {
    tags: selectedTags,
    query,
    page,
    selector: sortOption.selector,
    limit
  })

  return (
    <MainContent>
      {foundProjects.length > 0 ? (
        <PaginationProvider
          total={total}
          currentPageNumber={page}
          limit={limit}
        >
          <ProjectPaginatedList
            projects={foundProjects}
            query={query}
            page={page}
            total={total}
            limit={limit}
            sortOption={sortOption}
            showBookmarkSortOption={false}
          >
            <PageTitle>
              <SearchResultsTitle
                query={query}
                selectedTags={selectedTags}
                total={total}
              />
            </PageTitle>
          </ProjectPaginatedList>
        </PaginationProvider>
      ) : (
        <EmptyContent>
          <NoProjectsFound query={query} selectedTags={selectedTags} />
        </EmptyContent>
      )}
    </MainContent>
  )
}

const SearchResultsTitle = ({ query, selectedTags, total }) => {
  const isListFiltered = query !== '' || selectedTags.length > 0
  const tags = useSelector(getTagsById(selectedTags))

  if (!isListFiltered) return <>All Projects</>

  if (tags.length === 1 && !query) {
    return (
      <>
        {tags[0].name} tag: {showCount(total, 'project')}
      </>
    )
  }
  return <>Search results: {showCount(total, 'project')} found</>
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

const NoProjectsFound = withRouter(
  ({ query, selectedTags, history, location }) => {
    const tags = useSelector(getTagsById(selectedTags)).filter(tag => !!tag)
    console.log({ query, selectedTags, tags })
    const Title = () => {
      const QueryPart = () => {
        if (!query) return null
        return <> "{query}" </>
      }
      const TagPart = () => {
        if (!tags.length) return null
        if (tags.length === 1) return <> with the tag "{tags[0].name}"</>
        return (
          <> with the tags {tags.map(tag => `"${tag.name}"`).join(' and ')}</>
        )
      }

      return (
        <div style={{ marginBottom: '1rem' }}>
          No project
          <QueryPart /> was found
          <TagPart />.
        </div>
      )
    }

    const resetQuery = () => {
      const nextLocation = updateLocation(location, { query: '' })
      history.push(nextLocation)
    }
    return (
      <>
        <Title />
        <Button onClick={() => history.push('/projects')}>
          View all projects
        </Button>

        {tags.length > 0 && query && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>Reset the query:</div>
            <Button onClick={resetQuery}>
              <span style={{ textDecoration: 'line-through' }}>{query}</span>
            </Button>
          </div>
        )}

        {tags.length > 1 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              Or select only <b>one</b> tag:
            </div>
            <TagLabelGroup tags={tags} />
          </div>
        )}
      </>
    )
  }
)
