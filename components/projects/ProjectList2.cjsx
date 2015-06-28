React = require 'react'
Router = require 'react-router'
mui = require('material-ui')
{List, ListItem} = mui
TagMenu = require './TagMenu'
SortMenu = require './SortMenu'
flux = require('../../scripts/app')
Delta = require('../common/utils/Delta')
Stars = require('../common/utils/Stars')

{Link} = Router;
{ Paper, Toolbar, ToolbarGroup, DropDownMenu, TextField } = mui;

ProjectList = React.createClass

  render: ->

    <List>
      {this.props.projects.map (project, index) ->
        <ProjectList.Item project={ project } key={ project._id } index={ index }/>
      }
    </List>


ProjectList.Item = React.createClass

  render: ->
    <ListItem style={{ backgroundColor: 'white' }}
      secondaryText={
        @props.project.description
      }
    >
        { @props.project.name }
    </ListItem>








module.exports = ProjectList
