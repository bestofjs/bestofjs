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
    return (
      <div id="searchbox">
        <input
          type="text"
          onChange={ this.handleChange }
          autoFocus
        />
        <span className="mega-octicon octicon-search icon"></span>
      </div>
    );
  }
});
export default SearchForm;
