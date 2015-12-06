import React from 'react';
import { connect } from 'react-redux';

import { fetchReadme } from '../actions'
import Project from '../components/projects/Project';
import populate from '../helpers/populate';

function loadData(props) {
  const project = props.project;
  props.fetchReadme(project);
}

const ProjectPage  = React.createClass({

  componentWillMount() {
    loadData(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      loadData(nextProps);
    }
  },

  render: function() {
    console.info('Render the PROJECT container!', this.props);
    const { project } = this.props;
    return (
      <Project
        project = { project }
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
  } = state.githubProjects;

  const id = state.router.params.id;

  let project = projects[id];

  project = populate(tags)(project);

  return {
    project: project
  };
}

export default connect(mapStateToProps, {
  fetchReadme
})(ProjectPage);
