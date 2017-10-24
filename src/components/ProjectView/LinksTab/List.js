import React from 'react'
import { Link } from 'react-router-dom'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import ProjectLink from './ProjectLink'

const AddButton = ({ project }) => {
  return (
    <Link to={`/projects/${project.slug}/links/add`} className="btn">
      <span className={'octicon octicon-plus'} /> ADD A LINK
    </Link>
  )
}

const LoginButton = ({ onLogin, pending }) => {
  if (pending) return 'Loading...'
  return (
    <button className="btn" onClick={onLogin}>
      <span className={'octicon octicon-mark-github'} /> Sign in with GitHub to
      add a link
    </button>
  )
}

const List = ({ project, auth, authActions }) => {
  const isLoggedin = auth.username !== ''
  const links = project.links || []
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="links" />
      <div className="project-tabs-content" style={{ marginBottom: '2em' }}>
        <div className="inner">
          {links.length === 0 && (
            <div>
              <p>Find here intesting reading about {project.name} project:</p>
              <ul>
                <li>blog entries</li>
                <li>tutorials</li>
                <li>related projects</li>
                <li>real-world applications...</li>
              </ul>
              <p>Be the first to add a link!</p>
            </div>
          )}
          {links.length > 0 && (
            <div className="project-link-container">
              {links.map(link => (
                <ProjectLink
                  link={link}
                  project={project}
                  key={link._id}
                  editable={auth.username === link.createdBy}
                  showProjects={false}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', paddingTop: '1em' }}>
            {isLoggedin ? (
              <AddButton project={project} />
            ) : (
              <LoginButton onLogin={authActions.login} pending={auth.pending} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
