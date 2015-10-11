var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var actions = require('../../scripts/actions');

require('../../stylesheets/menu.styl');

var Sidebar = React.createClass({
  render: function() {
    var tags = this.props.tags;
    return (
      <div id="menu">
        <div className="ui vertical menu" style={{ minHeight: 28 * tags.length , marginBottom: 20 }}>
          <Link to="home" className="item">HOME</Link>
          <Link to="about" className="item">ABOUT</Link>
          <div className="item">
            <div className="header">TAGS</div>
            <TagMenu tags={ tags } selectedTag={ this.props.selectedTag }></TagMenu>
          </div>
        </div>
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
            params={{ id: tag.code }}
            key={ tag.code }
            tag={ tag }
            active={ tag.code === this.props.selectedTag.code }
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
