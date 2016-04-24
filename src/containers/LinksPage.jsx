import React from 'react';
import { connect } from 'react-redux';

import Links from '../components/links/Links';
import log from '../helpers/log';

const Page = React.createClass({
  render() {
    log('Render the <Link> container', this.props);
    const { links, isLoggedin, username } = this.props;
    return (
      <Links
        links = {links}
        isLoggedin = {isLoggedin}
        username = {username}
      />
    );
  }
});

// Return the `link` with populated projects
const populate = (allProjects) => link => {
  const projects = link.projects.map(id => allProjects[id]);
  return Object.assign({}, link, { projects });
};

const getDate = item => {
  const displayDate = item.updatedAt ? item.updatedAt : item.createdAt;
  return new Date(displayDate);
};

// sort reviews by date, in decreasing order
const sortByDate = (a, b) => (
  getDate(a) > getDate(b) ? -1 : 1
);

function mapStateToProps(state) {
  const {
    entities: {
      projects,
      // tags,
      links
    },
    auth: {
      username
    }
  } = state;

  const topLinks = Object.keys(links)
    .map(key => links[key])
    .sort(sortByDate)
    .map(link => populate(projects)(link));

  return {
    links: topLinks,
    isLoggedin: username !== '',
    username
  };
}

export default connect(mapStateToProps, {
})(Page);
