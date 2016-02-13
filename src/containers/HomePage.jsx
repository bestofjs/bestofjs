import React from 'react';
import { connect } from 'react-redux';

import Home from '../components/home/Home';
import populate from '../helpers/populate';
import log from '../helpers/log';

const HomePage = React.createClass({
  shouldComponentUpdate() {
    return true;
  },
  render() {
    log('Render the <HomePage> container', this.props);
    const { hotProjects, popularProjects, isLoggedin } = this.props;
    return (
      <Home
        hotProjects = { hotProjects }
        popularProjects = { popularProjects }
        maxStars = { popularProjects.length > 0 ? popularProjects[0].stars : 0 }
        isLoggedin = { isLoggedin }
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: {
      projects,
      tags,
      links
    },
    githubProjects: {
      hotProjectIds,
      popularProjectIds
    },
    auth: {
      username
    }
  } = state;

  const hotProjects = hotProjectIds
    .map(id => projects[id])
    .slice(0, 20) // display only the 20 hottest projects
    .map(populate(tags, links));
  const popularProjects = popularProjectIds
    .map(id => projects[id])
    .slice(0, 20) // display the "TOP20"
    .map(populate(tags, links));

  return {
    hotProjects,
    popularProjects,
    isLoggedin: username !== ''
  };
}

export default connect(mapStateToProps, {
})(HomePage);
