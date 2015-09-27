var React = require('react');
var Router = require('react-router');
var {Link} = Router;

var actions = require('../../scripts/actions');

var SearchContainer = require('./SearchContainer');
var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var TagList = require('../tags/TagList');
var SearchForm = require('./SearchForm');
var SearchResultList = require('./SearchResultList');

var TextFilter = React.createClass({
  mixins: [ Router.State ],

  componentDidMount: function() {
    this.loadData(this.props);
  },
  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps);
  },
  loadData: function (props) {
    var text = this.getParams().text;
    if (text !== props.searchText) {
      console.log('====> trigger `actions.changeText` from TextFilter.jsx');
      actions.changeText(text);
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

module.exports = TextFilter;
