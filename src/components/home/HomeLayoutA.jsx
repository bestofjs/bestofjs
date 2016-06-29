import React from 'react'

import ProjectList from '../projects/ProjectList'
import HotFilterPicker from './HotFilterPicker'

// explanation added below the combobox used to to set the sort filter
const addedSince = (hotFilter) => {
  if (hotFilter === 'weekly') return 'last week'
  if (hotFilter === 'monthly') return 'last month'
  if (hotFilter === 'quaterly') return 'last quarter'
  return 'yesterday'
}

const HomeA = ({
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
        <h3 className="with-comment">
          <span className="mega-octicon octicon-flame icon"></span>
          <span>Hot projects </span>
          <HotFilterPicker
            currentValue={hotFilter}
            onToggle={uiActions.toggleHotFilter}
            items={[
              {
                value: 'daily',
                text: 'yesterday'
              },
              {
                value: 'weekly',
                text: 'last week'
              },
              {
                value: 'monthly',
                text: 'last month'
              },
              {
                value: 'quaterly',
                text: 'last 3 months'
              }
            ]}
          />
        </h3>
        <p className="explanation">
          By number of stars added {addedSince(hotFilter)} on Github
        </p>
        <ProjectList
          projects = { hotProjects }
          maxStars = { maxStars }
          isLoggedin= { isLoggedin }
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
        <h3 className="with-comment">
          <span className="mega-octicon octicon-star icon"></span>
          Most popular projects
        </h3>
        <p className="explanation">By total number of stars on Github</p>
        <ProjectList
          projects = { popularProjects }
          maxStars = { maxStars }
          isLoggedin= { isLoggedin }
          showStars
          showDelta={false}
          showIndex
          showMetrics={showMetrics}
        />
      </div>
    </div>
  </div>
)

export default HomeA
