var React = require('react');
var Router = require('react-router');
//var {Link} = Router;

var actions = require('../../scripts/actions');

var SearchContainer = require('./SearchContainer');
var MainContent = require('../common/MainContent');


var TagFilter = React.createClass({
  mixins: [ Router.State ],
  componentDidMount: function() {
    this.loadData(this.props);
  },
  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps);
  },
  loadData: function (props) {
    var id = this.getParams().id;
    if (id !== props.selectedTag._id) {
      if (id) {
        console.log('Launch selectTag action');
        actions.selectTag(id);
      } else {
        console.log('Launch removeTag action');
        actions.removeTag();
      }

    }
  },

  render: function() {
    return (
      <MainContent>

        <SearchContainer {...this.props} />

      </MainContent>
    );
  }

});

module.exports = TagFilter;
