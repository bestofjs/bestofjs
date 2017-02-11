import React from 'react'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ProjectFilterTabs from '../ProjectSortFilter'
// import StarsByDateGraph from './StarsByDateGraph'
// import DeltaGraph from './DeltaGraph'
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

const TagFilter = React.createClass({

  render () {
    const { tag, projects, graphProjects, isLoggedin, ui, count } = this.props
    const showGraph = false
    const showStars = ui.starFilter === 'total' || ui.starFilter === 'packagequality' || ui.starFilter === 'npms'
    return (
      <MainContent className="container">
        <div className="">
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
        </div>

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
          />
       )}
      </MainContent>
    )
  }
})
export default TagFilter
