import React from 'react'

import ProjectList from '../projects/ProjectTable'
// import ProjectFilterTabs from './ProjectFilter/ProjectFilterTabs'
// import ProjectFilterCombobox from './ProjectFilter/ProjectFilterCombobox'

// explanation added below the combobox used to to set the sort filter
const addedSince = (hotFilter) => {
  if (hotFilter === 'weekly') return 'last week'
  if (hotFilter === 'monthly') return 'last month'
  if (hotFilter === 'quaterly') return 'last quarter'
  return 'yesterday'
}

const HomeB = ({
  hotProjects,
  popularProjects,
  maxStars,
  isLoggedin,
  uiActions,
  hotFilter,
  showMetrics
}) => (
  <div className="row">
    { /* Part 1: HOT projects */ }
    <div className="col-sm-6">
      <div className="box">
        <ProjectList
          title={'Hot projects'}
          comment={`By stars added ${addedSince(hotFilter)} on Github`}
          icon={'octicon-flame'}
          projects={hotProjects}
          maxStars={maxStars}
          isLoggedin={isLoggedin}
          showDelta
          deltaFilter={hotFilter}
          showStars={false}
          showIndex
          showMetrics={showMetrics}
        />
      </div>
    </div>

    { /* Part 2: Overall rankings */ }
    <div className="col-sm-6">
      <div className="box">
        <ProjectList
          title={'Most popular projects'}
          comment={'By total number of stars on Github'}
          icon={'octicon-star'}
          projects={popularProjects}
          maxStars={maxStars}
          isLoggedin={isLoggedin}
          showStars
          showDelta={false}
          showIndex
          showMetrics={showMetrics}
        />
      </div>
    </div>
  </div>
)

export default HomeB
