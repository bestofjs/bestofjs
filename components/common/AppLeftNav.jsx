var React = require('react');
var mui = require('material-ui');
var { LeftNav } = mui;

var menuItems = [
  { route: 'home', text: 'HOME' },
  { route: 'project-list', text: 'PROJECTS' },
  { route: 'about', text: 'ABOUT' }
];

var AppLeftNav = React.createClass({

  render: function() {
    var header = <div className="logo" onClick={this._onHeaderClick}>MENU</div>;
    return (

      <LeftNav
        menuItems={menuItems}
        isInitiallyOpen={false}
        docked={false}
        header={header}
        ref="leftNav"
        selectedIndex= { this._getSelectedIndex() }
        onChange={ this._onLeftNavChange }
      />
    );
  },

  toggle() {
    this.refs.leftNav.toggle();
  },

  _getSelectedIndex: function() {
    var currentItem;

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
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
