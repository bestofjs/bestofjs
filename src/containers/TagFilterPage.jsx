import React from 'react';
import { connect } from 'react-redux';

import TagFilter from '../components/home/TagFilter';
import populate from '../helpers/populate';
import log from '../helpers/log';

const TagFilterPage = React.createClass({

  shouldComponentUpdate(nextProps) {
    if (!nextProps.tag) return false;
    return nextProps.tag.id !== this.props.tag.id;
  },

  render() {
    log('Render the <TagFilterPage> container', this.props);
    const { tagProjects, tag, isLoggedin } = this.props;
    return (
      <TagFilter
        projects = { tagProjects }
        tag = { tag }
        maxStars = { tagProjects.length > 0 ? tagProjects[0].stars : 0 }
        isLoggedin = { isLoggedin }
      />
    );
  }

});

function mapStateToProps(state, props) {
  const {
    entities: { projects, tags, links },
    githubProjects: { popularProjectIds },
    auth: {
      username
    }
  } = state;

  const tagId = props.params.id;

  const tagProjects = popularProjectIds
    .map(id => projects[id])
    .filter(project => project.tags.indexOf(tagId) > -1)
    .slice(0, 50)
    .map(populate(tags, links));

  return {
    tagProjects,
    tag: tags[tagId],
    isLoggedin: username !== ''
  };
}

export default connect(mapStateToProps, {
})(TagFilterPage);
