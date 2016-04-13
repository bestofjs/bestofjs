import React from 'react';
import { connect } from 'react-redux';

import Home from '../components/home/Home';
import populate from '../helpers/populate';
import log from '../helpers/log';


const HomePage = React.createClass({
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

function finalMapStateToProps(count) {
  return function (state) {
    return mapStateToProps(state, count);
  };
}
function mapStateToProps(state, count) {
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
    .slice(0, count) // display only the 20 hottest projects
    .map(populate(tags, links));
  const popularProjects = popularProjectIds
    .map(id => projects[id])
    .slice(0, count) // display the "TOP20"
    .map(populate(tags, links));

  return {
    hotProjects,
    popularProjects,
    isLoggedin: username !== ''
  };
}
export default function (count = 10) {
  return connect(finalMapStateToProps(count), {})(HomePage);
}
