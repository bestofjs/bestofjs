var React = require('react');
var Router = require('react-router');
var {Link} = Router;

var ProjectList = require('../projects/ProjectList');
var SearchText = require('../common/utils/SearchText');
var TagLabel = require('../tags/TagTitle');

var SearchResultList = React.createClass({

  render: function() {
    var projects = this.props.projects;
    var tag = this.props.tag;
    var style={
      container: {
        margin: '0'
      }
    };
    return (
      <div style={ style.container }>

        { tag.name && (
          <div style={{ fontSize: 18, marginBottom: 20 }}>
            <Link to="home">
              <TagLabel tag={ tag } />
            </Link>
            <span style={{  marginLeft: 10 }}>
              { projects.length === 1 ? (
                'Only one project for now'
              ) : (
                projects.length +' projects'
              ) }
            </span>
          </div>
        ) }

        { (this.props.searchText && projects.length > 0) && (
          <h3>
            Results for <SearchText>{ this.props.searchText }</SearchText>:{' '}
            {projects.length } projects found.
           </h3>
        )}

        { (this.props.searchText && projects.length === 0) && (
          <div>No project found for <SearchText>{ this.props.searchText }</SearchText></div>
        )}


        { projects.length > 0 && (
         <div>
           <ProjectList
             projects = { projects }
             maxStars = { projects[0].stars}
             showDescription = { true }
             showURL = { true }
           />
         </div>
       ) }

    </div>
    );
  }

});

module.exports = SearchResultList;
