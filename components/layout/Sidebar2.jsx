var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var TagList = require('../tags/TagList');
var actions = require('../../scripts/actions');

require('../../stylesheets/menu.styl');

var Sidebar = React.createClass({

  render: function() {
    return (
      <div id="menu">
        <TagMenu tags={ this.props.tags } selectedTag={ this.props.selectedTag }></TagMenu>
      </div>
    );
  }

});

module.exports = Sidebar;



var TagMenu = React.createClass({

  render: function() {
    return (
      <div className="tag-menu">
        { this.props.tags.map( (tag) =>
          <Link
            to={ 'tags' }
            params={{ id: tag._id }}
            key={ tag._id }
            tag={ tag }
            active={ tag._id === this.props.selectedTag._id }
            className={"tag-menu-item" + (this.props.active ? ' active' : '')}
          >
            { tag.name }
            <span className="counter">{ tag.counter }</span>
          </Link>
         ) }
      </div>
    );
  }

});

TagMenu.Item = React.createClass({

  handleClick: function (e) {
    e.preventDefault();
    actions.selectTag(this.props.tag);
  },

  render: function() {
    var tag = this.props.tag;
    return (
      <a
        className={"tag-menu-item" + (this.props.active ? ' active' : '')}
        href="#"
        onClick={ this.handleClick }
      >
        { tag.name }
        <span className="counter">{ tag.counter }</span>
      </a>
    );
  }

});
