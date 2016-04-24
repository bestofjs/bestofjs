import React, { PropTypes } from 'react';

import Tabs from '../Tabs';

const Links = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render() {
    const { project, link, auth, authActions, children } = this.props;
    return (
      <div>
        <Tabs project={project} activePath="links" />
          { children && project && React.cloneElement(children, {
            project,
            link,
            auth,
            authActions
          }) }
      </div>
    );
  }
});
export default Links ;
