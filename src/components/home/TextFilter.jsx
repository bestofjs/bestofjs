import React from 'react';
import MainContent from '../common/MainContent';
import ProjectList from '../projects/ProjectList';
import SearchText from '../common/utils/SearchText';

const TextFilter = React.createClass({
  render() {
    const { projects, searchText } = this.props;
    return (
      <MainContent className="small">

        { projects.length > 0 ? (
          <h3>
            Results for <SearchText>{ searchText }</SearchText>:{' '}
            {projects.length } projects found.
          </h3>
        ) : (
          <div>No project found for <SearchText>{ searchText }</SearchText></div>
        )}

        { projects.length > 0 && (
           <ProjectList
             projects = { projects }
             maxStars = { projects[0].stars}
             showDescription
             showURL
           />
       ) }
      </MainContent>
    );
  }

});

module.exports = TextFilter;
