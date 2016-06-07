import React from 'react'
import { VirtualScroll, AutoSizer } from 'react-virtualized'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ProjectListItem from '../projects/ProjectListItem'
import HotFilterPicker from '../home/HotFilterPicker'
import log from '../../helpers/log'

const AllProjects = React.createClass({

  render() {
    const { projects, isLoggedin, ui, uiActions } = this.props
    log('Render the <AllProjects> component', this.props)
    return (
      <MainContent className="container">

        <div className="tag-page-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 className="with-comment" style={{ fontSize: '1.2rem' }}>
              <span className="mega-octicon octicon-list-ordered icon"></span>
              {' '}
              All projects
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

        <div className="project-list">
          <AutoSizer disableHeight>
            {({ width }) => (
              <VirtualScroll
                width={width}
                height={500}
                rowCount={projects.length}
                rowHeight={100}
                rowRenderer={
                  ({ index }) => (
                    <ProjectListItem
                      project={ projects[index] }
                    />
                  )
                }
              />
            )}
          </AutoSizer>
        </div>

        {false && <VirtualScroll
          width={500}
          height={300}
          rowCount={projects.length}
          rowHeight={400}
          rowRenderer={
            ({ index }) => (
              <ProjectCard
                project={ projects[index] }
                index={ index }
                showTags
                showDescription
                showStars={ this.props.showStars }
                showDelta={ this.props.showDelta}
                deltaFilter={ this.props.deltaFilter}
                showURL={ this.props.showURL }
                showMetrics={ this.props.showMetrics }
              />
            )
          }
        />}

      { false && projects.length > 0 && (
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

export default AllProjects
