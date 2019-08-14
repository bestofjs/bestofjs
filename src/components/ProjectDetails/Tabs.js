import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Div = styled.div`
  display: flex;
  margin-bottom: -1px;
  > div {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0;
  }
  > div.active {
    border: 1px solid #ccc;
    border-bottom-color: #fff;
    background-color: #fff;
    z-index: 1;
  }
  > div a {
    display: block;
  }
  > div a:hover {
    text-decoration: none;
  }
`

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

const Tabs = ({ activePath, project, links, reviews }) => {
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
      counter: project => links && links.length
    },
    {
      path: 'reviews',
      text: 'REVIEWS',
      icon: 'heart',
      counter: project => reviews && reviews.length
    }
  ]
  return (
    <Div className="project-tabs-header">
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
    </Div>
  )
}

export default Tabs
