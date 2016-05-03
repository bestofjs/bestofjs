import React from 'react';
import { Link, IndexLink } from 'react-router';

import TagMenu from './TagMenu';
import LoggedinUser from './LoggedinUser';
import AnonymousUser from './AnonymousUser';

const Sidebar = React.createClass({
  render() {
    const { allTags, popularTags, auth, authActions } = this.props;
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
          <Link to="/links" className="item">LINKS</Link>
          <Link to="/hof" className="item">HALL OF FAME</Link>
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
    );
  }

});

module.exports = Sidebar;
