import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ProjectFilterTabs from './ProjectFilter/ProjectFilterTabs'
import ProjectFilterCombobox from './ProjectFilter/ProjectFilterCombobox'
import ProjectViewOptions from './ProjectViewOptions'
import items from './ProjectFilter/items'

const TagFilter = React.createClass({

  render () {
    const { tag, projects, isLoggedin, ui, uiActions } = this.props
    const showStars = ui.starFilter === 'total' || ui.starFilter === 'packagequality' || ui.starFilter === 'npms'
    function changeTagFilter (value) {
      const item = items.find(item => item.value === value)
      const url = `/tags/${tag.id}/${item.url}`
      browserHistory.push(url)
    }
    return (
      <MainContent className="container">
        {tag.name && (
          <div>
            <div className="card card-homepage">
              <div className="header">
                <div className="inner">
                  <span className="icon mega-octicon octicon-tag icon" />
                  {' '}
                  <span style={{ fontSize: '1.5rem' }}>{tag.name}</span>
                  <span className="counter">
                    {projects.length === 1 ? (
                      ' (one project)'
                    ) : (
                      ` (${projects.length} projects)`
                    )}
                  </span>
                </div>
              </div>

              <ProjectFilterTabs
                currentValue={ui.starFilter}
                tag={tag.id}
                onToggle={uiActions.toggleStarFilter}
              />
              <ProjectFilterCombobox
                currentValue={ui.starFilter}
                onToggle={changeTagFilter}
              />
              <ProjectViewOptions
                values={ui.viewOptions}
                onChange={uiActions.toggleViewOption}
                open={ui.showViewOptions}
                onToggle={uiActions.toggleShowViewOptions}
                sortFilter={ui.starFilter}
              />
            </div>
          </div>
        )}

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
