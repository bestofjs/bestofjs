var React = require('react');
var {Navigation, State} = require('react-router');

var SearchForm = React.createClass({
  mixins: [Navigation, State],
  getInitialState: function() {
    return {
      text: this.props.searchText
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.loadData();
    var routes = this.getRoutes();
    var isSearchPage = routes[1].name == 'search';
    if (!isSearchPage && nextProps.searchText === '') {
      this.setState({text: ''});
    }
  },
  componentDidMount: function() {
    this.loadData();
    this.emitChangeDelayed = _.debounce(this.emitChange, 300);
  },
  loadData: function () {
    var text = this.getParams().text;
    if (!text) return;
    //console.log('param', text);
    if (this.props.searchText !== text) {
      this.setState({text: text});
      //actions.changeText(text);
    }
  },
  handleChange: function (e) {
    var text = e.target.value;
    this.setState({
      text: text
    });
    this.emitChangeDelayed(text);
  },
  emitChange: function (text) {
    if (text) {
      this.transitionTo('search', { text: text });
    } else {
      this.transitionTo('home');
    }
    console.log('SearchForm emitChange', text);
    //actions.changeText(text);
  },
  render: function() {
    var style = {
      //width: '100%',
      boxSizing: 'border-box',//to prevent the input from overlapping the container
      padding: '0.5em 1em',
      border: '2px solid #ddd',
      borderRadius: 6,
      fontSize: '1em'
    };
    return (
        <div className="ui input icon">
          <input
            type="text"
            style={ style }
            value={ this.state.text }
            onChange={ this.handleChange }
          />
          <i className="fa fa-search ui icon" style={{ color: '#dddddd' }} />
        </div>
    );
  }

});

module.exports = SearchForm;
