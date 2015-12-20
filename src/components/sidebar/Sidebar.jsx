import React from 'react';
var Router = require('react-router');
var { Link, IndexLink } = Router;

import TagMenu from './TagMenu';
import LoggedinUser from './LoggedinUser';
import AnonymousUser from './AnonymousUser';

var Sidebar = React.createClass({
  render() {
    var { allTags, popularTags, auth, authActions } = this.props;
    return (
      <nav id="menu">
        <div className="ui vertical menu">
          <div className="item">
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
          <IndexLink to="/" className="item">HOME</IndexLink>
          <Link to="/about" className="item">ABOUT</Link>
          <div className="item">
            <div className="header">POPULAR TAGS</div>
            <TagMenu tags={ popularTags } selectedTag={ this.props.selectedTag } />
          </div>
          <div className="item">
            <div className="header">ALL TAGS</div>
            <TagMenu tags={ allTags } selectedTag={ this.props.selectedTag } />
          </div>
        </div>
      </nav>
    );
  }

});

module.exports = Sidebar;
