import React, { useContext } from 'react'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import useReactRouter from 'use-react-router'
import { parse, stringify } from 'qs'

import ProjectTable from '../project-list/ProjectTable'
import PaginationControls from '../common/pagination/PaginationControls'
import { PaginationContext } from '../common/pagination/provider'
import { SortOrderPicker } from './sort-order'

export const ProjectPaginatedList = ({
  projects,
  query,
  page,
  total,
  limit,
  sortOption,
  showBookmarkSortOption,
  children
}) => {
  const { from, to, pageNumbers } = useContext(PaginationContext)
  const { location, history } = useReactRouter()

  const handleChange = sortId => {
    const changes = { sort: sortId }
    history.push({ ...resetPage(location, changes) })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: '0 0 50%' }}>
          {children}
          {pageNumbers.length > 1 && (
            <SubTitle>
              Showing{' '}
              {from === to ? (
                `#${from}`
              ) : (
                <>
                  {from} - {to} of {total}
                </>
              )}
            </SubTitle>
          )}
        </div>
        <div style={{ flex: '0 0 50%' }}>
          <SortOrderPicker
            onChange={handleChange}
            value={sortOption.id}
            showBookmark={showBookmarkSortOption}
          />
        </div>
      </div>
      <br />
      <ProjectTable
        projects={projects}
        showStars={false}
        from={from}
        sortOption={sortOption}
      />
      <PaginationControls total={total} currentPage={page} limit={limit} />
    </div>
  )
}

const SubTitle = styled.div`
  margin-top: 0.5rem;
  color: #788080;
  fontsize: 16px;
`

function resetPage(location, changes) {
  const { search, pathname } = location
  const previousParams = parse(search, { ignoreQueryPrefix: true })
  const params = { ...previousParams, ...changes }
  delete params.page
  if (params.sort === 'bookmark' && pathname !== '/bookmarks') {
    delete params.sort
  }
  const result = { ...location, search: stringify(params, { encode: false }) }
  return result
}
