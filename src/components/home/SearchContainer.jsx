var React = require('react');
var Router = require('react-router');
var {Link} = Router;


var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var TagList = require('../tags/TagList');
var SearchForm = require('./SearchForm');
var SearchResultList = require('./SearchResultList');

var TagFilter = React.createClass({
  mixins: [ Router.State ],
  render: function() {
    return (
      <div>

        {false && <SearchForm
          searchText = { this.props.searchText }
        />}

      { (this.props.searchText.length > 0 || this.props.selectedTag._id)  && (
          <SearchResultList
            projects = { this.props.filteredProjects }
            searchText = { this.props.searchText }
            tag = { this.props.selectedTag }
            onRemoveTag = { this.props.actions.removeTag }
          />
        ) }

      </div>
    );
  }

});

module.exports = TagFilter;
