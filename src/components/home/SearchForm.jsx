import React from 'react';
import debounce from 'lodash/function/debounce';

const SearchForm = React.createClass({
  getInitialState() {
    return {
      text: this.props.searchText
    };
  },
  componentDidMount() {
    this.emitChangeDelayed = debounce(this.emitChange, 300);
  },
  emitChange(text) {
    this.props.onChange(text);
  },
  handleChange(e) {
    const text = e.target.value;
    this.setState({
      text
    });
    this.emitChangeDelayed(text);
  },
  render() {
    const style = {
      boxSizing: 'border-box', // to prevent the input from overlapping the container
      padding: '0.5em 1em',
      border: '3px solid #ddd',
      borderRadius: 6,
      fontSize: '1em'
    };
    return (
      <div className="ui input icon" style={{ width: 250 }}>
        <input
          type="text"
          style={ style }
          onChange={ this.handleChange }
          autoFocus
        />
        <span className="mega-octicon octicon-search ui icon"></span>
      </div>
    );
  }
});
module.exports = SearchForm;
