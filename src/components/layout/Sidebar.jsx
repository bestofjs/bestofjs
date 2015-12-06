var React = require('react');
var Router = require('react-router');
var { Link, IndexLink, History } = Router;

require('../../stylesheets/menu.styl');

var Sidebar = React.createClass({
  render: function() {
    var tags = this.props.tags;
    return (
      <nav id="menu">
        <div className="ui vertical menu">
          <IndexLink to="/" className="item">HOME</IndexLink>
          <Link to="/about" className="item">ABOUT</Link>
          <div className="item">
            <div className="header">TAGS</div>
            <TagMenu tags={ tags } selectedTag={ this.props.selectedTag }></TagMenu>
          </div>
        </div>
      </nav>
    );
  }

});

module.exports = Sidebar;

var TagMenu = React.createClass({
  render: function() {
    return (
      <div className="tag-menu">
        { this.props.tags.map( (tag) =>
          <TagMenu.item
            tag={ tag }
            key={ tag.id }
            active={ tag.id === this.props.selectedTag.id }
          />
         ) }
      </div>
    );
  }
});


TagMenu.item  = React.createClass({

  render: function() {
    var {tag, active} = this.props;
    return (
      <Link
        href={ '#/tags/' + tag.id }
        to={ '/tags/' + tag.id }
        className={"tag-menu-item" + (active ? ' active' : '')}
      >
        { tag.name }
        <span className="counter">{ tag.counter }</span>
      </Link>
    );
  }

});
