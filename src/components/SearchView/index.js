import React from 'react'
import { Link } from 'react-router-dom'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import SearchText from '../common/utils/SearchText'
import HeroCardList from '../hof/HeroCardList'

const showCount = (array, text) => `${array.length} ${text}${array.length > 1 ? 's' : ''}`

const TextFilter = React.createClass({
  render () {
    const { projects, heroes, searchText, isLoggedin, auth, ui } = this.props
    return (
      <MainContent className="container">

        {projects.length > 0 ? (
          <h3 className="no-card-container">
            Results for <SearchText>{searchText}</SearchText>:{' '}
            {showCount(projects, 'project')} found.
          </h3>
        ) : (
          heroes.length === 0 && (
            <div className="no-card-container">
              No project found for <SearchText>{searchText}</SearchText>
            </div>
          )
        )}

        {projects.length > 0 && (
          <ProjectList
            projects={projects}
            maxStars={projects[0].stars}
            isLoggedin={isLoggedin}
            showDescription
            showDelta={false}
            showURL
            viewOptions={ui.viewOptions}
          />
       )}

        {heroes.length > 0 && (
          <div style={{ marginTop: projects.length > 0 ? '2em' : 0 }}>
            <h3>
              Results for <SearchText>{searchText}</SearchText>:{' '}
              {showCount(heroes, 'Hall of famer')} found.
            </h3>
            <HeroCardList
              heroes={heroes}
              auth={auth}
              showDetails
            />
            <div style={{ textAlign: 'center', padding: '2em' }}>
              To see more amazing people, <Link to="/hof">Visit the Hall of Fame !</Link>
            </div>
          </div>
        )}

      </MainContent>
    )
  }
})

export default TextFilter
