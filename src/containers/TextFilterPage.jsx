import React from 'react';
import { connect } from 'react-redux';

import TextFilter from '../components/home/TextFilter';
import populate from '../helpers/populate';
import log from '../helpers/log';

function filterProject(project, text) {
  // if only one letter is entered, we search projects whose name start by the letter
  const pattern = text.length > 1 ? text : '^' + text;
  const re = new RegExp(pattern, 'i');
  if (re.test(project.name)) {
    return true;
  }
  if (text.length > 2) {
    if (re.test(project.description)) {
      return true;
    }
    if (re.test(project.repository)) {
      return true;
    }
    if (re.test(project.url)) {
      return true;
    }
  }
  return false;
}

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

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    githubProjects: { popularProjectIds },
    auth: {
      username
    }
  } = state;

  const text = state.router.params.text;

  const foundProjects = popularProjectIds
    .map(id => projects[id])
    .filter(project => filterProject(project, text))
    .slice(0, 50)
    .map(populate(tags));

  return {
    foundProjects,
    text,
    isLoggedin: username !== ''
  };
}

export default connect(mapStateToProps, {
})(TextFilterPage);
