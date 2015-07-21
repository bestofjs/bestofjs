var React = require('react');

var ProjectList = require('../projects/ProjectList');
var SearchText = require('../common/utils/SearchText');

var SearchResultList = React.createClass({

  render: function() {
    var projects = this.props.projects;
    var style={
      container: {
        margin: '20px 0'
      }
    };
    return (
      <div style={ style.container }>
        { projects.length > 0 ? (
          <div>
            <h3>
              Results for <SearchText>{ this.props.searchText }</SearchText>:{' '}
              {projects.length } projects found.
              </h3>
            <ProjectList
              projects = { projects }
              maxStars = { projects[0].stars}
              showDescription = { true }
            />
          </div>
        ) : (
          <div>No project found for <SearchText>{ this.props.searchText }</SearchText></div>
        )}
    </div>
    );
  }

});

module.exports = SearchResultList;
