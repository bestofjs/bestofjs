var React = require('react');

var flux = require('../../scripts/app');

var SearchForm = React.createClass({
  getInitialState: function() {
    return {
      text: this.props.searchText
    };
  },
  componentDidMount: function() {
    this.broadcast = _.debounce(this.broadcast, 500);
  },
  handleChange: function (e) {
    var text = e.target.value;
    this.setState({
      text: text
    });
    this.broadcast(text);
  },
  broadcast: function (text) {
    flux.actions.changeText(text);
  },
  render: function() {
    return (
      <form className="pure-form" style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search for projects" style={{ width: '100%' }}
          value={ this.state.text }
          onChange={ this.handleChange }
        />
      </form>
    );
  }

});

module.exports = SearchForm;
