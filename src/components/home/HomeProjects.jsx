import React from 'react'

import ProjectList from '../projects/ProjectTable'
import ProjectFilterTabs from './ProjectFilter/ProjectFilterTabs'
import ProjectFilterCombobox from './ProjectFilter/ProjectFilterCombobox'

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
          projects = { hotProjects }
          maxStars = { maxStars }
          isLoggedin= { isLoggedin }
          showDelta
          deltaFilter={hotFilter}
          showStars={false}
          showIndex
          showMetrics={showMetrics}
        >
          <div className="header">
            <div className="inner">
              <span className="mega-octicon octicon-flame icon"></span>
              {' '}
              <span className="big">Hot projects</span>
              {false && <p className="comment">
                By number of stars added {addedSince(hotFilter)} on Github
              </p>}
            </div>
          </div>
          <ProjectFilterTabs
            currentValue={hotFilter}
            onToggle={uiActions.toggleHotFilter}
            category="trend"
          />
          <ProjectFilterCombobox
            currentValue={hotFilter}
            onToggle={uiActions.toggleHotFilter}
          />
        </ProjectList>
      </div>
    </div>

    { /* Part 2: Overall rankings */ }
    <div className="col-sm-6">
      <div className="box">
        <ProjectList
          projects = { popularProjects }
          maxStars = { maxStars }
          isLoggedin= { isLoggedin }
          showStars
          showDelta={false}
          showIndex
          showMetrics={showMetrics}
        >
          <div className="header">
            <div className="inner">
              <span className="mega-octicon octicon-star icon"></span>
              {' '}
              <span className="big">Popular projects</span>
              <div className="comment" style={{ padding: '0.3rem 0', marginLeft: 34, borderBottom: 'solid 3px transparent' }}>
                By total number of stars on Github
              </div>
            </div>
          </div>
        </ProjectList>
      </div>
    </div>
  </div>
)

export default HomeB
