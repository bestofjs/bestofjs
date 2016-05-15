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
          <div className="tag-page-header" style={{ marginBottom: 20 }}>
            <div>
              <TagLabel tag={ tag } />

              { projects.length === 1 ? (
                ' Only one project for now'
              ) : (
                ` ${projects.length} projects`
              ) }
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
             projects={ projects }
             showDescription
             showURL
             isLoggedin={ isLoggedin }
             showDelta={ui.starFilter !== 'total'}
             deltaFilter={ui.starFilter}
             showStars={ui.starFilter === 'total'}
           />
       ) }

      </MainContent>
    )
  }
})

module.exports = TagFilter
