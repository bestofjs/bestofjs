import React from 'react';
import { connect } from 'react-redux';

import Project from '../components/projects/Project';
import { fetchReadmeIfNeeded } from '../actions';
import populate from '../helpers/populate';
import log from '../helpers/log';

function loadData(props) {
  const project = props.project;
  props.fetchReadme(project);
}

const ProjectPage = React.createClass({

  componentWillMount() {
    loadData(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      loadData(nextProps);
    }
  },

  render() {
    log('Render the <ProjectPage> container', this.props);
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
  } = state;

  const id = state.router.params.id;

  let project = projects[id];

  project = populate(tags)(project);

  return {
    project
  };
}

export default connect(mapStateToProps, {
  fetchReadme: fetchReadmeIfNeeded
})(ProjectPage);
