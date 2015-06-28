React = require 'react'
Router = require 'react-router'
mui = require('material-ui')
Colors = mui.Styles.Colors
TagMenu = require './TagMenu'
SortMenu = require './SortMenu'
flux = require('../../scripts/app')
Delta = require('../common/utils/Delta')
Stars = require('../common/utils/Stars')

{Link} = Router;
{ Paper, Toolbar, ToolbarGroup, DropDownMenu, TextField } = mui;

ProjectList = React.createClass

  onChangeText: (e) ->
    flux.actions.changeText e.target.value

  render: ->

    <div>
      <table className="pure-table pure-table-striped2">
        <tbody>
          {this.props.projects.map (project, index) =>
            <ProjectList.Item project={ project } maxStars={ this.props.maxStars } key={ project._id } index={ index }/>
          }
        </tbody>
      </table>
    </div>


ProjectList.Item = React.createClass
  render: ->
    style =
      td:
        padding: 0
        verticalAlign: 'top'
      starsBar:
        height: 2
        backgroundColor: Colors.amber200
        width: (@props.project.stars * 100 / @props.maxStars).toFixed() + '%'
      inner:
        padding: '0.5em 1em'
    <tr>
      {false and (<td>{ @props.index + 1 }</td>)}
      <td style={ style.td }>
        <div style={ style.starsBar } />
        <div style= { style.inner }>
          <Link
            to={ 'projects' }
            params={{ id: @props.project._id }}
          >
          { @props.project.name }
          </Link>
        </div>
      </td>
      <td>
        <Stars value={ @props.project.stars } />
      </td>
      <td>
        <Delta value={  @props.project.delta1 } />
       </td>
    </tr>








module.exports = ProjectList
