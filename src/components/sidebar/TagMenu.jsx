import React from 'react';
var Router = require('react-router');
var { Link, IndexLink } = Router;

const TagMenu = React.createClass({
  render() {
    return (
      <div className="tag-menu">
        { this.props.tags.map(tag =>
          <TagMenu.item
            tag={ tag }
            key={ tag.id }
            active={ tag.id === this.props.selectedTag }
          />
         ) }
      </div>
    );
  }
});
export default TagMenu;


TagMenu.item = React.createClass({
  render() {
    const { tag, active } = this.props;
    return (
      <Link
        href={ '#/tags/' + tag.id }
        to={ '/tags/' + tag.id }
        className={ 'tag-menu-item' + (active ? ' active' : '')}
      >
        { tag.name }
        <span className="counter">{ tag.counter }</span>
      </Link>
    );
  }
});
