import React from 'react';
import Home from '../components/home/Home';
import { connect } from 'react-redux';
//import { loadUser, loadStarred } from '../actions'
//var PropTypes = React.PropTypes;

const HomePage  = React.createClass({

  render: function() {
    console.log('Render the HOME container', this.props);
    const { hotProjects, popularProjects } = this.props;
    return (
      <Home
        hotProjects = { hotProjects }
        popularProjects = { popularProjects }
        maxStars = { popularProjects.length > 0 ? popularProjects[0].stars : 0 }
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    hotProjectIds,
    popularProjectIds
  } = state.githubProjects;
  console.info('TAGS', tags);
  function populate(project) {
    project.tags = project.tags.map( id => tags[id] );
    return project;
  }

  const hotProjects = hotProjectIds
    .map( id => projects[id] )
    .slice(0, 2)
    .map( populate );
  const popularProjects = popularProjectIds
    .map( id => projects[id] )
    .slice(0, 2)
    .map( populate );

  return {
    hotProjects,
    popularProjects
  };
}

export default connect(mapStateToProps, {
})(HomePage);
