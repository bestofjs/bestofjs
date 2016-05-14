import React from 'react'
import Link from 'react-router/lib/Link'
import IndexLink from 'react-router/lib/IndexLink'

import TagMenu from './TagMenu'
import LoggedinUser from './LoggedinUser'
import AnonymousUser from './AnonymousUser'

const Sidebar = React.createClass({
  render() {
    const { allTags, popularTags, auth, authActions, hofCount, linkCount } = this.props
    return (
      <nav id="menu" className="slideout-menu">
        <div className={`sidebar-login-block ${auth.username ? 'loggedin' : 'anonymous'}`}>
          { auth.username ? (
            <LoggedinUser
              username={ auth.username }
              onLogout={ authActions.logout }
              pending={ auth.pending }
            />
          ) : (
            <AnonymousUser
              onLogin={ authActions.login }
              pending={ auth.pending }
            />
          )}
        </div>
        <div className="ui vertical menu">
          <IndexLink to="/" className="item">HOME</IndexLink>
          <Link to="/links" className="item">
            LINKS
            {linkCount > 0 && <span className="counter">{linkCount}</span>}
          </Link>
          <Link to="/hof" className="item">
            HALL OF FAME
            {hofCount > 0 && <span className="counter">{hofCount}</span>}
          </Link>
          <div className="item">
            <div className="header">POPULAR TAGS</div>
            <TagMenu tags={ popularTags } selectedTag={ this.props.selectedTag } />
          </div>
          <div className="item">
            <div className="header">ALL TAGS</div>
            <TagMenu tags={ allTags } selectedTag={ this.props.selectedTag } />
          </div>
          <Link to="/about" className="item">ABOUT</Link>
        </div>
      </nav>
    )
  }
})
export default Sidebar
