import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'

import { MainContent, PageTitle, Spinner } from 'components/core'
import { /*getFeaturedProjects,*/ allProjects } from 'selectors'
// import { useSearch } from 'components/search'
import { useSelector } from 'containers/project-data-container'
import { Avatar } from 'components/core/project'

export const TimelinePage = () => {
  // const { sortOption } = useSearch({ defaultSortOptionId: 'newest' })
  // const projects = useSelector(getFeaturedProjects(sortOption.id))
  const projects = useSelector(allProjects)
  if (!projects.length) return <Spinner />
  const byYear: Record<string, BestOfJS.Project[]> = groupBy(
    projects,
    getProjectYear
  )
  console.log({ byYear })
  return (
    <MainContent>
      <PageTitle>
        Timeline <i>(Under construction)</i>
      </PageTitle>
      <PageDescription>
        Some of the most significant projects over the last 12 years, by date of
        creation on GitHub.
      </PageDescription>
      <Wrapper>
        {Object.keys(byYear).map((year: string) => (
          <YearRow key={year} year={year} projects={byYear[year]} />
        ))}
      </Wrapper>
    </MainContent>
  )
}

export default TimelinePage

const YearRow = ({ year, projects }) => {
  return (
    <>
      <YearCell>{year}</YearCell>
      <YearProjects>
        {orderBy(projects, ['stars'], ['desc'])
          .slice(0, 10)
          .map(project => (
            <div key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="hint--top"
                aria-label={project.name}
              >
                <Avatar project={project} size={50} />
              </Link>
            </div>
          ))}
      </YearProjects>
    </>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  > div {
    background-color: white;
    padding: 1rem;
  }
`
const YearCell = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`
const YearProjects = styled.div`
  margin-bottom: 1rem;
  background-color: white;
  display: flex;
  > div {
    margin-right: 1rem;
  }
`

const getProjectYear = (project: BestOfJS.ProjectDetails) =>
  new Date(project.created_at).getFullYear()

const PageDescription = styled.div`
  padding-left: 1rem;
  border-left: 2px solid #fa9e59;
  margin-bottom: 2rem;
`
