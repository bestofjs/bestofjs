import React, { PropTypes } from 'react';

import Tabs from './Tabs';

const Reviews = React.createClass({
  propTypes: {
    project: PropTypes.object.isRequired
  },
  render() {
    const { project } = this.props;
    return (
      <div>
        <Tabs project={project} activePath="reviews" />
          <div className="project-tabs-content">
            <p>
              <span className="octicon octicon-info"></span>
              {' '}
              Find here what users really think reading about {project.name} project.
              <br />
              Any feedback is welcome!
            </p>
            <p>
              Stay tuned, reviews are coming soon!
            </p>
          </div>

      </div>
    );
  }
});
export default Reviews;
