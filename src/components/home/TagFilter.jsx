import React from 'react'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import HotFilterPicker from './HotFilterPickerB'

const TagFilter = React.createClass({

  render() {
    const { tag, projects, isLoggedin, ui, uiActions } = this.props
    const showStars = ui.starFilter === 'total' || ui.starFilter === 'quality'
    return (
      <MainContent className="smallW container double-padding">
        { tag.name && (
          <div style={{ marginBottom: '1rem' }}>
            <div className="card card-homepage">
              <div className="header">
                <div className="inner">
                  <span className="icon mega-octicon octicon-tag icon"></span>
                  {' '}
                  <span style={{ fontSize: '1.5rem' }}>{tag.name}</span>
                  <span className="counter">
                    { projects.length === 1 ? (
                      ' (Only one project)'
                    ) : (
                      ` (${projects.length} projects)`
                    ) }
                  </span>
                </div>
                <HotFilterPicker
                  currentValue={ui.starFilter}
                  onToggle={uiActions.toggleStarFilter}
                />
              </div>
            </div>
          </div>
        ) }

        { projects.length > 0 && (
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
           />
       ) }

      </MainContent>
    )
  }
})
export default TagFilter
