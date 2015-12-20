import React from 'react';
import Router from 'react-router';
var { Link } = Router;

var TagMenu = React.createClass({
  render() {
    return (
      <div className="tag-menu">
        { this.props.tags.map(tag =>
          <TagMenu.ItemX
            tag={ tag }
            key={ tag.id }
            active={ tag.id === this.props.selectedTag }
          />
         ) }
      </div>
    );
  }
});

TagMenu.ItemX = React.createClass({
  render() {
    const { tag, active } = this.props;
    return (
      <Link
        to={ '/tags/' + tag.id }
        className={ 'tag-menu-item' + (active ? ' active' : '')}
      >
        { tag.name }
        <span className="counter">{ tag.counter }</span>
      </Link>
    );
  }
});
module.exports = TagMenu;
