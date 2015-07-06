var React = require('react');

var flux = require('../../scripts/app');

require('./style.styl');

var SearchForm = React.createClass({
  getInitialState: function() {
    return {
      text: this.props.searchText
    };
  },
  componentDidMount: function() {
    this.emitChangeDelayed = _.debounce(this.emitChange, 300);
  },
  handleChange: function (e) {
    var text = e.target.value;
    this.setState({
      text: text
    });
    this.emitChangeDelayed(text);
  },
  emitChange: function (text) {
    flux.actions.changeText(text);
  },
  render: function() {
    var style = {
      width: '100%',
      boxSizing: 'border-box',//to prevent the input from overlapping the container
      padding: '0.5em 1em',
      border: '1px solid #cbcbcb',
      fontSize: '1em'
    };
    return (
      <form className="pure-formXXX" style={{ marginBottom: 20 }}>
        <div className="ui input icon">
          <input
            type="text"
            placeholder="Search for projects"
            style={ style }
            value={ this.state.text }
            onChange={ this.handleChange }
          />
        <i className="fa fa-search ui icon" />
        </div>
      </form>
    );
  }

});

module.exports = SearchForm;
