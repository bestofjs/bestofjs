import React from 'react'
import { useSelector } from 'react-redux'

import { useSearch } from '../components/search/SearchProvider'
import {
  PaginationProvider,
  paginateItemList
} from '../components/core/pagination'
import { ProjectPaginatedList } from '../components/search/project-paginated-list'
import { PageTitle, MainContent } from '../components/core'
import { StarIcon } from '../components/core/icons'
import { getFeaturedProjects } from '../selectors'

export const FeaturedPage = () => {
  const { page, sortOption } = useSearch({ defaultSortOptionId: 'newest' })
  const projects = useSelector(getFeaturedProjects(sortOption.id))

  const total = projects.length
  const limit = 30
  const paginatedProjects = paginateItemList(projects, page, { limit })

  return (
    <MainContent>
      <PaginationProvider total={total} currentPageNumber={page} limit={limit}>
        <PageTitle
          icon={<StarIcon size={32} />}
          extra={total === 1 ? '(one project)' : `(${total} projects)`}
        >
          Featured projects
        </PageTitle>
        <ProjectPaginatedList
          projects={paginatedProjects}
          page={page}
          total={total}
          limit={limit}
          sortOption={sortOption}
        />
      </PaginationProvider>
    </MainContent>
  )
}
