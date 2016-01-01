import React, { PropTypes } from 'react';

import ProjectLink from './ProjectLink';

const ProjectCardLink = React.createClass({
  propTypes: {
    links: PropTypes.array.isRequired,
    isLoggedin: PropTypes.bool
  },
  showLinkCount(count) {
    if (count === 0) return <span>No links</span>;
    if (count === 1) return 'One link:';
    return <span>{count} links</span>;
  },
  render() {
    const { links, isLoggedin } = this.props;
    return (
      <div className="inner links" style={{ borderTop: '1px solid #ddd' }}>
        <header>
          { this.showLinkCount(links.length) }
        </header>
        <main>
        { links.map(link => <ProjectLink link={ link } key={ link.id } />) }
        </main>
        {isLoggedin &&
          <footer style={{ textAlign: 'center', paddingTop: '0.5em' }}>
            <button className="btn">ADD A LINK</button>
          </footer>
        }
      </div>
    );
  }
});
export default ProjectCardLink;
