import React from 'react'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import TagLabel from '../tags/TagTitle'
import HotFilterPicker from './HotFilterPicker'

const TagFilter = React.createClass({

  render() {
    const { tag, projects, isLoggedin, ui, uiActions } = this.props
    return (
      <MainContent className="small container">
        { tag.name && (
          <div className="tag-page-header" style={{ marginBottom: '1rem' }}>
            <div>
              {false && <TagLabel tag={ tag } />}
              <h3 className="with-comment" style={{ fontSize: '1.2rem' }}>
                <span className="mega-octicon octicon-tag icon"></span>
                {tag.name}
              <span className="counter-small"> ({projects.length})</span>
              <span className="counter-big">
                { projects.length === 1 ? (
                  ' (Only one project)'
                ) : (
                  ` (${projects.length} projects)`
                ) }
              </span>

              </h3>
            </div>

            <div>
              <HotFilterPicker
                currentValue={ui.starFilter}
                onToggle={uiActions.toggleStarFilter}
              />
            </div>
          </div>
        ) }

        { projects.length > 0 && (
           <ProjectList
             projects={projects}
             showDescription
             showURL
             isLoggedin={isLoggedin}
             showDelta={ui.starFilter !== 'total'}
             deltaFilter={ui.starFilter}
             showStars={ui.starFilter === 'total'}
             showMetrics={ui.showMetrics}
           />
       ) }

      </MainContent>
    )
  }
})
export default TagFilter
