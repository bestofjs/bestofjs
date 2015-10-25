var React = require('react');
var Router = require('react-router');
var { Link, IndexLink, History } = Router;
import pushState from 'redux-router';

require('../../stylesheets/menu.styl');

var Sidebar = React.createClass({
  render: function() {
    var tags = this.props.tags;
    return (
      <div id="menu">
        <div className="ui vertical menu" style={{ minHeight: 28 * tags.length , marginBottom: 20 }}>
          <IndexLink to="/" className="item">HOME</IndexLink>
          <Link to="/about" className="item">ABOUT</Link>
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
          <TagMenu.item
            tag={ tag }
            key={ tag.code }
            active={ tag.code === this.props.selectedTag.code }
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
        href={ '#/tags/' + tag.code }
        to={ '/tags/' + tag.code }
        className={"tag-menu-item" + (active ? ' active' : '')}
      >
        { tag.name }
        <span className="counter">{ tag.counter }</span>
      </Link>
    );
  }

});
TagMenu.item2  = React.createClass({
  mixins: [ History ],
  handleClick: function (tag) {
    console.info('===== CLICK =====', tag.code);
    //pushState(null, '/tags/' + tag.code);
    this.history.pushState(null, `/tags/${tag.code}`);
  },
  render: function() {
    var {tag, active} = this.props;
    return (
      <button
        onClick={ () => this.handleClick(tag) }
      >
        { tag.name }
        <span className="counter">{ tag.counter }</span>
      </button>
    );
  }

});
