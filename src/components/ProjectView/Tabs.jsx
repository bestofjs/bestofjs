import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Tabs = React.createClass({
  propTypes: {
    activePath: PropTypes.string,
    project: PropTypes.object
  },
  renderTab(tab) {
    const count = tab.counter && tab.counter(this.props.project);
    return (
      <span>
        <span className={`octicon octicon-${tab.icon}`}></span>
        {' '}
        {tab.text}
        { count && <span> ({count})</span> }
      </span>
    );
  },
  render() {
    const tabs = [
      {
        path: 'readme',
        text: 'GITHUB',
        icon: 'book'
      },
      {
        path: 'links',
        text: 'LINKS',
        icon: 'link',
        counter: project => project.links && project.links.length
      },
      {
        path: 'reviews',
        text: 'REVIEWS',
        icon: 'heart',
        counter: project => project.reviews && project.reviews.length
      },
    ];
    const { activePath, project } = this.props;
    return (
      <div className="project-tabs-header">
        { tabs.map(tab =>
          <div key={ tab.path } className={activePath === tab.path ? 'active' : ''}>
            { activePath === tab.path ? (
              this.renderTab(tab)
            ) : (
              <Link to={`/projects/${project.id}/${tab.path}`}>
                {this.renderTab(tab)}
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }
});
export default Tabs;
