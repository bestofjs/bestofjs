import React from 'react'
import { Link } from 'react-router-dom'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
import HomeProjects from './HomeProjects'
import CreateIssueLink from '../user-requests/add-project/CreateIssueLink'

const Home = props => {
  log('Render the <Home> component', props)
  const { isLoggedin, pending, authActions, popularTags } = props
  return (
    <MainContent>
      <div className="no-card-container">
        <h1 className="with-comment" style={{ margin: '0 0 1rem' }}>
          The best of JavaScript, HTML, CSS
        </h1>
        <p style={{ fontSize: '1.1rem' }}>
          Check out the most popular open-source projects and the latest trends
          about the web platform and node.js.
        </p>
      </div>

      <hr />

      <h3 className="no-card-container" style={{ margin: '0rem 0 2rem' }}>
        <span className="icon mega-octicon octicon-flame" />
        Today hot projects
        <span
          className="counter"
          style={{ fontSize: '1rem', color: '#aaa', marginLeft: '.5rem' }}
        >
          (by number of stars added yesterday)
        </span>
      </h3>
      <HomeProjects {...props} />

      <hr />

      <div className="no-card-container">
        <h3 className="with-comment" style={{ margin: '0 0 1rem' }}>
          Find the <i className="special">best</i> components to build amazing
          web applications!
        </h3>
        <p>
          View <Link to="/projects">ALL PROJECTS</Link> or check one of the
          popular tags:
        </p>
        <TagList tags={popularTags} />
      </div>

      <hr />

      <MoreProjects
        handleClick={authActions.login}
        isLoggedin={isLoggedin}
        pending={pending}
      />

      <hr />
    </MainContent>
  )
}

const MoreProjects = ({ pending }) => {
  return (
    <div className="no-card-container">
      <h3 className="with-comment" style={{ marginBottom: '0.5rem' }}>
        Do you want more projects ?
      </h3>
      <CreateIssueLink
        className={`btn block button-outline${pending
          ? ' ui loading button'
          : ''}`}
      >
        <span className="octicon octicon-mark-github" /> Create an issue on
        GitHub
      </CreateIssueLink>
    </div>
  )
}

export default Home

const TagList = ({ tags }) =>
  <ul>
    {tags.map(tag =>
      <li key={tag.id}>
        <Link to={`/tags/${tag.id}`}>{tag.name}</Link> ({tag.counter} projects)
      </li>
    )}
  </ul>

// const Hero = () => (
//   <div id="hero">
//     <div className="container no-card-container">
//       <h1 className="with-comment" style={{ margin: '0 0 1rem' }}>
//         The best of JavaScript, HTML, CSS
//       </h1>
//       <p style={{ fontSize: '1.1rem' }}>
//         Check out the most popular open-source projects and the latest trends about the web platform and node.js.
//       </p>
//     </div>
//   </div>
// )
