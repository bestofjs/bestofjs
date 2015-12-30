import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProjectView from '../components/ProjectView';
import populate from '../helpers/populate';
import log from '../helpers/log';

// import { fetchReadmeIfNeeded } from '../actions';
import * as actionCreators from '../actions';
import * as authActionCreators from '../actions/authActions';

function loadData(props) {
  const project = props.project;
  props.actions.fetchReadme(project);
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
    const { project, auth, path, children, authActions } = this.props;
    return (
      <ProjectView
        project={project}
        auth ={auth}
        path={path}
        authActions={authActions}
      >
      { children && project && React.cloneElement(children, {
        project,
        auth
      }) }
    </ProjectView>
    );
  }

});

function mapStateToProps(state, props) {
  const {
    entities: { projects, tags, links },
    auth,
    routing
  } = state;

  const id = props.params.id;

  let project = projects[id];

  project = populate(tags, links)(project);

  return {
    project,
    auth,
    path: routing.path
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
// export default connect(mapStateToProps, {
//   fetchReadme: fetchReadmeIfNeeded
// })(ProjectPage);
