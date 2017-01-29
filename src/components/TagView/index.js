import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ProjectFilterTabs from '../ProjectSortFilter'
import ProjectFilterCombobox from '../ProjectSortFilter/ProjectFilterCombobox'
import ProjectViewOptions from '../ProjectSortFilter/ProjectViewOptions'
import items from '../ProjectSortFilter/items'
import StarsByDateGraph from './StarsByDateGraph'
import DeltaGraph from './DeltaGraph'
import TagViewTitle from './TagViewTitle'

const TagFilter = React.createClass({

  render () {
    const { tag, projects, graphProjects, isLoggedin, ui, uiActions, count } = this.props
    const showStars = ui.starFilter === 'total' || ui.starFilter === 'packagequality' || ui.starFilter === 'npms'
    function changeTagFilter (value) {
      const item = items.find(item => item.value === value)
      const url = `/tags/${tag.id}/${item.url}`
      browserHistory.push(url)
    }
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
          )
          }

          <ProjectFilterTabs
            currentValue={ui.starFilter}
            rootUrl={tag ? `/tags/${tag.id}` : '/projects'}
          />
          {false && <ProjectFilterCombobox
            currentValue={ui.starFilter}
            onToggle={changeTagFilter}
          />}
          {false && <ProjectViewOptions
            values={ui.viewOptions}
            onChange={uiActions.toggleViewOption}
            open={ui.showViewOptions}
            onToggle={uiActions.toggleShowViewOptions}
            sortFilter={ui.starFilter}
          />}
        </div>

        {ui.starFilter === 'total' && (
          <StarsByDateGraph projects={graphProjects} sortOrder={ui.starFilter} />
        )}
        {['yearly', 'quaterly', 'monthly', 'weekly', 'daily'].includes(ui.starFilter) && (
          <DeltaGraph projects={graphProjects} sortOrder={ui.starFilter} />
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
