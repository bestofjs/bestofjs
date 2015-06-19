React = require 'react'
mui = require('material-ui')
TagMenu = require './TagMenu'
{ DropDownMenu } = mui;
flux = require('../../scripts/app')


SortMenu = React.createClass

  onChange: (e, selectedIndex, menuItem) ->
    flux.actions.selectSort
      index: selectedIndex,
      id: menuItem.payload

  render: ->
    menuItems = [
      payload: 'stars'
      text: 'Number of stars'
    ,
      payload: 'delta1'
      text: 'stars since yesterday'
    ,
      payload: 'delta2'
      text: 'stars since one week'
    ]
    <DropDownMenu
      menuItems={ menuItems }
      onChange={ this.onChange }
      selectedIndex={ this.props.selectedSort.index }
    />

module.exports = SortMenu
