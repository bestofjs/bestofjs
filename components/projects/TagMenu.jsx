var React = require('react');
var mui = require('material-ui');
mui = require('material-ui');
var { DropDownMenu } = mui;
var flux = require('../../scripts/app');



var TagMenu = React.createClass({

  render: function() {
    var menuItems = this.props.tags.map( function (tag) {
      return {
        payload: tag._id,
        text: tag.name
      };
    });
    menuItems.splice(0, 0, {payload:'*', text: 'All tags'});

    return (
      <DropDownMenu
        menuItems={menuItems}
        onChange={ this.onChange }
        selectedIndex={ this.props.selectedTag.index }
      />
    );
  },

  onChange: function(e,selectedIndex, menuItem) {
    flux.actions.selectTag({
      index: selectedIndex,
      id: menuItem.payload
    });
  }

});

module.exports = TagMenu;
