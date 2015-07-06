var React = require('react');
var mui = require('material-ui');
var { LeftNav } = mui;

var AppLeftNav = React.createClass({
  componentWillMount: function() {
    this.menuItems = [
      { route: 'home', text: 'HOME' },
      { route: 'project-list', text: 'PROJECTS' },
      { route: 'about', text: 'ABOUT' }
    ];
  },

  componentWillReceiveProps: function(nextProps) {
    //this.getMenuItems(nextProps.tags);
  },

  getMenuItems: function (tags) {
    var self = this;
    tags.forEach(function (tag) {
      self.menuItems.push({
        route: 'tags',
        payload: {id: tag._id},
        params: { id: tag._id },
        text: tag.name
      });
    });
  },

  render: function() {
    var header = <div className="logo" onClick={this._onHeaderClick}>MENU</div>;
    return (

      <LeftNav
        menuItems={ this.menuItems }
        isInitiallyOpen={ false }
        docked={ false }
        header={ header }
        ref="leftNav"
        selectedIndex= { this._getSelectedIndex() }
        onChange={ this._onLeftNavChange }
      ></LeftNav>
    );
  },

  toggle() {
    this.refs.leftNav.toggle();
  },

  _getSelectedIndex: function() {
    var currentItem;
    var self = this;
    for (var i = this.menuItems.length - 1; i >= 0; i--) {
      currentItem = this.menuItems[i];
      if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
    }
  },

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route);
  }

});

AppLeftNav.contextTypes = {
  router: React.PropTypes.func
};

module.exports = AppLeftNav;
