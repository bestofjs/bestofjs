import React from 'react'
import styled from '@emotion/styled'

import { useSelector } from 'containers/project-data-container'
import { useSearch } from 'components/search/search-container'
import {
  paginateItemList,
  PaginationContainer
} from 'components/core/pagination'
import { ProjectPaginatedList } from 'components/search/project-paginated-list'
import { PageTitle, MainContent } from 'components/core'
import { StarIcon } from 'components/core/icons'
import { getFeaturedProjects } from 'selectors'

export const FeaturedPage = () => {
  const { page, sortOption } = useSearch({ defaultSortOptionId: 'newest' })
  const projects = useSelector(getFeaturedProjects(sortOption.id))

  const total = projects.length
  const limit = 30
  const paginatedProjects = paginateItemList(projects, page, { limit })

  return (
    <MainContent>
      <PaginationContainer.Provider
        initialState={{ total, currentPageNumber: page, limit }}
      >
        <PageTitle
          icon={<StarIcon size={32} />}
          extra={total === 1 ? '(one project)' : `(${total} projects)`}
        >
          Featured projects
        </PageTitle>
        <PageDescription>
          An arbitrary selection of important projects with distinct logos.
        </PageDescription>
        <ProjectPaginatedList
          projects={paginatedProjects}
          page={page}
          total={total}
          limit={limit}
          sortOption={sortOption}
        />
      </PaginationContainer.Provider>
    </MainContent>
  )
}

const PageDescription = styled.div`
  padding-left: 1rem;
  border-left: 2px solid #fa9e59;
  margin-bottom: 1rem;
`
