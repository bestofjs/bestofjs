import React from 'react'
import { withRouter } from 'react-router-dom'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import orderBy from 'lodash.orderby'

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
import { TagIcon } from '../core/icons'
import { getProjectSelectorByKey } from '../../selectors/project'

export const SearchResultsContainer = () => {
  const { selectedTags, query, sortOption, page } = useSearch()
  const limit = 10

  const projects = useSelector(allProjects)
  const tags = useSelector(state => state.entities.tags)
  const auth = useSelector(state => state.auth)

  if (projects.length === 0) return <Spinner />

  const selector = getProjectSelectorByKey(sortOption.id)

  const { results: foundProjects, total, relevantTags } = findProjects(
    projects,
    tags,
    auth,
    {
      tags: selectedTags,
      query,
      page,
      selector,
      limit
    }
  )

  const includedTags =
    relevantTags && relevantTags.slice(0, 5).map(([tagId, count]) => tagId)

  return (
    <MainContent>
      {foundProjects.length > 0 ? (
        <PaginationProvider
          total={total}
          currentPageNumber={page}
          limit={limit}
        >
          <SearchResultsTitle
            query={query}
            selectedTags={selectedTags}
            total={total}
          />
          {includedTags.length > 0 && (
            <RelevantTags tagIds={includedTags} baseTagIds={selectedTags} />
          )}
          <ProjectPaginatedList
            projects={foundProjects}
            query={query}
            page={page}
            total={total}
            limit={limit}
            sortOption={sortOption}
          />
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

  if (!isListFiltered) return <PageTitle>All Projects</PageTitle>

  if (tags.length > 0 && !query) {
    return (
      <PageTitle icon={<TagIcon size={32} />}>
        {tags.map(tag => tag.name).join(' + ')}
        <span className="text-secondary" style={{ marginLeft: '0.5rem' }}>
          ({showCount(total, 'project')})
        </span>
      </PageTitle>
    )
  }
  return (
    <PageTitle style={{ paddingBottom: '1rem' }}>
      Search results: {showCount(total, 'project')} found
    </PageTitle>
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

  const sortedProjects = false ? foundProjects : sortBy(foundProjects, selector)

  const relevantTags =
    (tags.length > 0 || query) && getResultRelevantTags(sortedProjects, tags)

  const paginatedProjects = paginateItemList(sortedProjects, page, { limit })

  const results = paginatedProjects.map(getFullProject(tagsById, auth))

  return {
    results,
    relevantTags,
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

function getResultRelevantTags(projects, excludedTags = []) {
  const projectCountByTag = getTagsFromProjects(projects, excludedTags)
  return orderBy(
    Array.from(projectCountByTag.entries()),
    ([tagId, count]) => count,
    'desc'
  )
}

function getTagsFromProjects(projects, excludedTagIds = []) {
  const result = new Map()
  projects.forEach(project => {
    project.tags
      .filter(tagId => !excludedTagIds.includes(tagId))
      .forEach(tagId => {
        if (result.has(tagId)) {
          result.set(tagId, result.get(tagId) + 1)
        } else {
          result.set(tagId, 1)
        }
      })
  })
  return result
}

const RelevantTags = ({ tagIds, baseTagIds }) => {
  const tags = useSelector(getTagsById(tagIds))
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 0',
        borderTop: '1px dashed #cecece'
      }}
    >
      <div style={{ paddingRight: '0.5rem' }}>
        {baseTagIds.length === 0 ? 'Related tags:' : 'Refine your search:'}
      </div>
      <TagLabelGroup tags={tags} baseTagIds={baseTagIds} />
    </div>
  )
}
