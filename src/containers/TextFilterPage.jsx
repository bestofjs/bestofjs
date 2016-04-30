import React from 'react';
import { connect } from 'react-redux';

import TextFilter from '../components/home/TextFilter';
import populate from '../helpers/populate';
import log from '../helpers/log';
import filterProjects from '../helpers/filter';

const TextFilterPage = React.createClass({

  shouldComponentUpdate(nextProps) {
    return nextProps.text !== this.props.text;
  },

  render() {
    log('Render the <TextFilterPage> container', this.props);
    const { foundProjects, text, isLoggedin } = this.props;
    return (
      <TextFilter
        projects={ foundProjects }
        searchText={ text }
        isLoggedin={ isLoggedin }
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

  const text = props.params.text;
  const allTags = Object.keys(tags).map(id => tags[id]);

  const allProjects = popularProjectIds.map(id => projects[id]);
  const foundProjects = filterProjects(allProjects, allTags, text)
    .slice(0, 50)
    .map(populate(tags, links));

  return {
    foundProjects,
    text,
    isLoggedin: username !== ''
  };
}

export default connect(mapStateToProps, {
})(TextFilterPage);
