import React from 'react';
import { connect } from 'react-redux';

import TagFilter from '../components/home/TagFilter';
import populate from '../helpers/populate';

const TagFilterPage  = React.createClass({

  render: function() {
    console.log('Render the TAG FILTER container', this.props);
    const { tagProjects, tag } = this.props;
    return (
      <TagFilter
        projects = { tagProjects }
        tag = { tag }
        maxStars = { tagProjects.length > 0 ? tagProjects[0].stars : 0 }
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    popularProjectIds
  } = state.githubProjects;

  const tagId = state.router.params.id;

  const tagProjects = popularProjectIds
    .map( id => projects[id] )
    .filter( project => project.tagIds.indexOf(tagId) > -1 )
    .slice(0, 50)
    .map( populate(tags) );

  return {
    tagProjects,
    tag: tags[tagId]
  };
}

export default connect(mapStateToProps, {
})(TagFilterPage);
