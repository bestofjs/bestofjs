import React from 'react'
import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import SearchText from '../common/utils/SearchText'
import HeroCardList from '../hof/HeroCardList'

const showCount = (array, text) => `${array.length} ${text}${array.length > 1 ? 's' : ''}`

const TextFilter = React.createClass({
  render() {
    const { projects, heroes, searchText, isLoggedin, auth } = this.props
    return (
      <MainContent className="small container">

        { projects.length > 0 ? (
          <h3>
            Results for <SearchText>{ searchText }</SearchText>:{' '}
            {showCount(projects, 'project')} found.
          </h3>
        ) : (
          heroes.length === 0 && (
            <div>No project found for <SearchText>{ searchText }</SearchText></div>
          )
        )}

        { projects.length > 0 && (
           <ProjectList
             projects={ projects }
             maxStars={ projects[0].stars}
             isLoggedin={ isLoggedin}
             showDescription
             showDelta={false}
             showURL
           />
       ) }

        {heroes.length > 0 && (
          <div>
            <h3>
              Results for <SearchText>{ searchText }</SearchText>:{' '}
              {showCount(heroes, 'Hall of famer')} found.
            </h3>
            <HeroCardList
              heroes={heroes}
              auth={auth}
            />
          <div style={{ textAlign: 'center', padding: '2em' }}>
              To see more amazing people, <a href="/#/hof">Visit the Hall of Fame !</a>
            </div>
          </div>
        )}

      </MainContent>
    )
  }
})

export default TextFilter
