import React from 'react';
import { connect } from 'react-redux';

import TextFilter from '../components/home/TextFilter';
import populate from '../helpers/populate';
import log from '../helpers/log';

function filterProject(project, text) {
  //if only one letter is entered, we search projects whose name start by the letter
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

const TextFilterPage  = React.createClass({

  shouldComponentUpdate: function(nextProps) {
    return nextProps.text !== this.props.text;
  },

  render: function() {
    log('Render the <TextFilterPage> container', this.props);
    const { foundProjects, text } = this.props;
    return (
      <TextFilter
        projects = { foundProjects }
        searchText = { text }
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    popularProjectIds
  } = state.githubProjects;

  const text = state.router.params.text;

  const foundProjects = popularProjectIds
    .map( id => projects[id] )
    .filter( project => filterProject(project, text) )
    .slice(0, 50)
    .map( populate(tags) );

  return {
    foundProjects,
    text
  };
}

export default connect(mapStateToProps, {
})(TextFilterPage);
