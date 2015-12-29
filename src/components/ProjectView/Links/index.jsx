import React, { PropTypes } from 'react';

import Tabs from '../Tabs';

const Links = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render() {
    const { project, auth, authActions, children } = this.props;
    return (
      <div>
        <Tabs project={project} activePath="links" />
        <div className="project-tabs-content">

          { children && project && React.cloneElement(children, {
            project,
            auth,
            authActions
          }) }

        </div>
      </div>
    );
  }
});
export default Links ;
