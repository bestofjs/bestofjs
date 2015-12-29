import React, { PropTypes } from 'react';

import Tabs from './Tabs';

const Readme = React.createClass({
  propTypes: {
    project: PropTypes.object,
    isLoggedin: PropTypes.bool
  },
  render() {
    const { project } = this.props;
    return (
      <div>
        <Tabs project={project} activePath="readme" />
        <div className="readme">
          <div>
            {false && <div className="header">
              <span className="octicon octicon-book"></span>
              {' '}
              README
            </div>}

            <div className="body">
              { project.readme ? (
                <div dangerouslySetInnerHTML={{ __html: project.readme }}></div>
                ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#aaa' }}>Loading README from Github...</p>
                  <span className="mega-octicon octicon-book" style={{ margin: '1em 0', fontSize: 100, color: '#bbb' }}></span>
                </div>
              )}
            </div>

            <div className="footer" style={{ textAlign: 'center' }}>
              <a className="btn" href={ project.repository }>View on Github</a>
            </div>
          </div>
        </div>
    </div>
    );
  }
});
export default Readme;
