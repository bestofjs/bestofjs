import React from 'react'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ProjectFilterTabs from '../ProjectSortFilter'
import TagViewTitle from './TagViewTitle'

function renderGraph ({ projects, ui }) {
  const filters = ['yearly', 'quaterly', 'monthly', 'weekly', 'daily']
  console.log('[Disabled]', projects, ui, filters); // eslint-disable-line
  // if (ui.starFilter === 'total') return (
  //   <StarsByDateGraph projects={projects} sortOrder={ui.starFilter} />
  // )
  // return filters.includes(ui.starFilter) && (
  //   <DeltaGraph projects={projects} sortOrder={ui.starFilter} />
  // )
}

const TagFilter = ({ tag, projects, graphProjects, isLoggedin, ui, count }) => {
  const showGraph = false
  const showStars = ui.starFilter === 'total' || ui.starFilter === 'packagequality' || ui.starFilter === 'npms'
  return (
    <MainContent>
      {tag ? (
        <TagViewTitle
          title={tag.name}
          count={projects.length}
          icon={'tag'}
        />
      ) : (
        <TagViewTitle
          title={'All tags'}
          count={count}
          icon={'list-unordered'}
        />
      )}

      <ProjectFilterTabs
        currentValue={ui.starFilter}
        rootUrl={tag ? `/tags/${tag.id}` : '/projects'}
      />

      {showGraph && renderGraph({
        projects: graphProjects,
        ui
      })}

      {projects.length > 0 && (
        <ProjectList
          projects={projects}
          showDescription
          showURL
          isLoggedin={isLoggedin}
          showDelta={!showStars}
          deltaFilter={ui.starFilter}
          showStars={showStars}
          showTags={false}
          showMetrics={ui.showMetrics}
          viewOptions={ui.viewOptions}
          paginated={ui.paginated}
        />
     )}
    </MainContent>
  )
}

export default TagFilter
// export default () => <p>GO!</p>
