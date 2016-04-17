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
      container: {
        boxSizing: 'border-box', // to prevent the input from overlapping the container
        padding: '0 0.5em',
        border: '3px solid #ddd',
        borderRadius: 6,
        fontSize: '1em',
        outline: 0,
        display: 'flex',
        alignItems: 'center'
      },
      input: {
        outline: 0,
        borderStyle: 'none',
        fontSize: '1rem'
      },
      icon: {
        color: '#ddd'
      }
    };
    return (
      <div className="search-input-container" style={style.container}>
        <input
          type="text"
          onChange={ this.handleChange }
          autoFocus
          style={style.input}
        />
      <span className="mega-octicon octicon-search icon" style={style.icon}></span>
      </div>
    );
  }
});
module.exports = SearchForm;
