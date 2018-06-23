import React from 'react'
import Link from '../../common/form/Button/Link'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import ProjectLinkCard from './ProjectLinkCard'
import ProjectTabsContent from '../ProjectTabsContent'
import Button from '../../common/form/Button'

const AddButton = ({ project }) => {
  return (
    <Link to={`/projects/${project.slug}/links/add`}>
      <span className={'octicon octicon-plus'} /> ADD A LINK
    </Link>
  )
}

const LoginButton = ({ onLogin, pending }) => {
  if (pending) return 'Loading...'
  return (
    <Button className="btn" onClick={onLogin}>
      <span className={'octicon octicon-mark-github'} /> Sign in with GitHub to
      add a link
    </Button>
  )
}

const List = ({ project, auth, authActions }) => {
  const isAuthenticated = auth.username !== ''
  const links = project.links || []
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="links" />
      <ProjectTabsContent style={{ marginBottom: '2em' }}>
        <div className="inner">
          <p>
            Interesting links about <i>{project.name}</i> : blog entries,
            tutorials, related projects, real-world applications...
          </p>
          {links.length === 0 && <p>Be the first to add a link!</p>}
          <div style={{ textAlign: 'center', paddingTop: '1em' }}>
            {isAuthenticated ? (
              <AddButton project={project} />
            ) : (
              <LoginButton onLogin={authActions.login} pending={auth.pending} />
            )}
          </div>
        </div>
      </ProjectTabsContent>

      {links.length > 0 && (
        <div className="project-link-container">
          {links.map(link => (
            <ProjectLinkCard
              link={link}
              project={project}
              key={link._id}
              editable={auth.username === link.createdBy}
              showProjects={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default List
