var React = require('react');
var Router = require('react-router');
var { Link, IndexLink } = Router;

var Sidebar = React.createClass({
  render: function() {
    var { allTags, popularTags } = this.props;
    return (
      <nav id="menu">
        <div className="ui vertical menu">
          <IndexLink to="/" className="item">HOME</IndexLink>
          <Link to="/about" className="item">ABOUT</Link>
          <div className="item">
            <div className="header">POPULAR TAGS</div>
            <TagMenu tags={ popularTags } selectedTag={ this.props.selectedTag }></TagMenu>
          </div>
          <div className="item">
            <div className="header">ALL TAGS</div>
            <TagMenu tags={ allTags } selectedTag={ this.props.selectedTag }></TagMenu>
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
            active={ tag.id === this.props.selectedTag }
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
