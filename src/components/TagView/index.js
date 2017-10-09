import React from 'react'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ConnectedProjectList'
import ProjectFilterTabs from '../ProjectSortFilter'
import TagViewTitle from './TagViewTitle'
import withPaginationControls from '../common/pagination/withPaginationControls'

function renderGraph({ projects, ui }) {
  const filters = ['yearly', 'quaterly', 'monthly', 'weekly', 'daily']
  console.log('[Disabled]', projects, ui, filters) // eslint-disable-line
  // if (ui.starFilter === 'total') return (
  //   <StarsByDateGraph projects={projects} sortOrder={ui.starFilter} />
  // )
  // return filters.includes(ui.starFilter) && (
  //   <DeltaGraph projects={projects} sortOrder={ui.starFilter} />
  // )
}

const TagFilter = ({
  tag,
  projects,
  total,
  url,
  pageNumber,
  itemPerPage,
  graphProjects,
  isLoggedin,
  ui,
  showTags
}) => {
  const showGraph = false
  const showStars =
    ui.starFilter === 'total' ||
    ui.starFilter === 'packagequality' ||
    ui.starFilter === 'npms'
  const PaginatedList = withPaginationControls(ProjectList, {
    items: projects,
    total,
    pageSize: itemPerPage,
    pageNumber,
    url
  })
  return (
    <MainContent>
      {tag
        ? <TagViewTitle title={tag.name} count={total} icon={'tag'} />
        : <TagViewTitle
            title={'All tags'}
            count={total}
            icon={'list-unordered'}
          />}
      <ProjectFilterTabs
        currentValue={ui.starFilter}
        rootUrl={tag ? `/tags/${tag.id}` : '/projects'}
        withPagination={total > itemPerPage}
      />
      {showGraph &&
        renderGraph({
          projects: graphProjects,
          ui
        })}
      <PaginatedList
        items={projects}
        total={total}
        url={url}
        showDescription
        showURL
        isLoggedin={isLoggedin}
        showDelta={!showStars}
        deltaFilter={ui.starFilter}
        showStars={showStars}
        showTags={showTags}
        showMetrics={ui.showMetrics}
        viewOptions={ui.viewOptions}
      />
    </MainContent>
  )
}

export default TagFilter
// export default () => <p>GO!</p>
