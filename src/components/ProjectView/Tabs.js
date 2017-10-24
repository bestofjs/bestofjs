import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Tab = ({ tab, project }) => {
  const count = tab.counter && tab.counter(project)
  return (
    <span>
      <span className={`octicon octicon-${tab.icon}`} /> {tab.text}
      {count > 0 && <span> ({count})</span>}
    </span>
  )
}

Tab.propTypes = {
  project: PropTypes.object
}

const Tabs = ({ activePath, project }) => {
  const tabs = [
    {
      path: '',
      text: 'OVERVIEW',
      icon: 'mark-github'
    },
    {
      path: 'links',
      text: 'LINKS',
      icon: 'link',
      counter: project => project.links && project.links.length
    },
    {
      path: 'reviews',
      text: 'REVIEWS',
      icon: 'heart',
      counter: project => project.reviews && project.reviews.length
    }
  ]
  return (
    <div className="project-tabs-header">
      {tabs.map(tab => (
        <div key={tab.path} className={activePath === tab.path ? 'active' : ''}>
          {activePath === tab.path ? (
            <Tab tab={tab} project={project} />
          ) : (
            <Link to={`/projects/${project.slug}/${tab.path}`}>
              <Tab tab={tab} project={project} />
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default Tabs
