import React from 'react'
import { NavLink } from 'react-router-dom'

import TagMenu from './TagMenu'
import LoggedinUser from './LoggedinUser'
import AnonymousUser from './AnonymousUser'

const Sidebar = ({ allTags, popularTags, auth, authActions, hofCount, linkCount, requestCount, selectedTag }) => {
  const myProjectsCount = auth && auth.myProjects && auth.myProjects.length
  return (
    <nav id="menu" className="slideout-menu">
      <div className={`sidebar-login-block ${auth.username ? 'loggedin' : 'anonymous'}`}>
        {auth.username ? (
          <LoggedinUser
            username={auth.username}
            onLogout={authActions.logout}
            pending={auth.pending}
          />
        ) : (
          <AnonymousUser
            onLogin={authActions.login}
            pending={auth.pending}
          />
        )}
      </div>
      <div className="ui vertical menu">
        <NavLink to="/" className="item" exact activeClassName="active">
          HOME
        </NavLink>
        <NavLink to="/projects" className="item" activeClassName="active">
          ALL PROJECTS
        </NavLink>
        <NavLink to="/hof" className="item" activeClassName="active">
          HALL OF FAME
          {hofCount > 0 && <span className="counter">{hofCount}</span>}
        </NavLink>
        {false && <NavLink to="/links" className="item">
          LINKS
          {linkCount > 0 && <span className="counter">{linkCount}</span>}
        </NavLink>}
        {auth.username && <NavLink to="/myprojects" className="item" activeClassName="active">
          MY PROJECTS
          {myProjectsCount > 0 && <span className="counter">{myProjectsCount}</span>}
        </NavLink>}
        {auth.username && <NavLink to="/requests" className="item" activeClassName="active">
          MY REQUESTS
          {requestCount > 0 && <span className="counter">{requestCount}</span>}
        </NavLink>}
        <div className="item">
          <div className="header">POPULAR TAGS</div>
          <TagMenu
            tags={popularTags}
            selectedTag={selectedTag}
          />
        </div>
        <div className="item">
          <div className="header">ALL TAGS</div>
          <TagMenu
            tags={allTags}
            selectedTag={selectedTag}
          />
        </div>
        <NavLink to="/about" className="item" activeClassName="active">
          ABOUT
        </NavLink>
        <a href="https://risingstars2016.js.org/" className="item">
          RISING STARS 2016
        </a>
      </div>
    </nav>
  )
}

export default Sidebar
