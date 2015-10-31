var React = require('react');
var {History} = require('react-router');
import debounce from 'lodash/function/debounce';

var SearchForm = React.createClass({
  mixins: [History],
  getInitialState: function() {
    return {
      text: this.props.searchText
    };
  },
  componentDidMount: function() {
    //this.loadData();
    this.emitChangeDelayed = debounce(this.emitChange, 300);
  },
  loadData: function () {
    var text = this.props.params && this.props.params.text;
    if (!text) return;
    if (this.props.searchText !== text) {
      this.setState({text: text});
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
      this.history.pushState(null, `/search/${text}`);
    } else {
      this.history.pushState(null, '/');
    }
    //console.log('SearchForm emitChange', text);
  },
  render: function() {
    var style = {
      //width: '100%',
      boxSizing: 'border-box',//to prevent the input from overlapping the container
      padding: '0.5em 1em',
      border: '3px solid #ddd',
      borderRadius: 6,
      fontSize: '1em'
    };
    return (
        <div className="ui input icon">
          <input
            type="text"
            style={ style }
            onChange={ this.handleChange }
          />
          <i className="fa fa-search ui icon" style={{ color: '#dddddd' }} />
        </div>
    );
  }

});

module.exports = SearchForm;
