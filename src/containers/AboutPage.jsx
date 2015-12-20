import React from 'react';
import { connect } from 'react-redux';

import About from '../components/about/About';
import populate from '../helpers/populate';
import log from '../helpers/log';
import getStaticContent from '../staticContent';

const AboutPage = React.createClass({

  render() {
    log('Render the <AboutPage> container', this.props);
    const { staticContent, project } = this.props;
    return (
      <About
        project={ project }
        staticContent={ staticContent }
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    githubProjects: { popularProjectIds }
  } = state;

  const project = popularProjectIds
    .map(id => projects[id])
    .slice(0, 1)
    .map(populate(tags));

  return {
    project: project[0],
    staticContent: getStaticContent()
  };
}

export default connect(mapStateToProps, {
})(AboutPage);
