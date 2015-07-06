var React = require('react');
var mui = require('material-ui');
var { LeftNav } = mui;

var AppLeftNav = React.createClass({


  render: function() {
    var header = <div className="logo" onClick={this._onHeaderClick}>MENU</div>;

    return (

      <LeftNav

      ></LeftNav>
    );
  },

  toggle() {
    this.refs.leftNav.toggle();
  },

});

AppLeftNav.contextTypes = {
  router: React.PropTypes.func
};

module.exports = AppLeftNav;
