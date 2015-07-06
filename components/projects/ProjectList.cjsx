React = require 'react'
Router = require 'react-router'
mui = require('material-ui')
Colors = mui.Styles.Colors
TagMenu = require './TagMenu'
TagLabel = require '../tags/TagLabelCompact'
SortMenu = require './SortMenu'
flux = require('../../scripts/app')
Delta = require('../common/utils/Delta')
Stars = require('../common/utils/Stars')

{Link} = Router;
{ Paper, Toolbar, ToolbarGroup, DropDownMenu, TextField } = mui;

ProjectList = React.createClass

  getDefaultProps: ->
    showTags: true
    showDescription: false


  onChangeText: (e) ->
    flux.actions.changeText e.target.value

  render: ->

    <div>
      <table className="pure-table pure-table-striped2" style={ width: '100%'}>
        <tbody>
          {this.props.projects.map (project, index) =>
            <ProjectList.Item
              project={ project }
              maxStars={ this.props.maxStars }
              key={ project._id }
              index={ index }
              {...this.props}
             />
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
        height: 3
        backgroundColor: Colors.amber200
        width: (@props.project.stars * 100 / @props.maxStars).toFixed() + '%'
      inner:
        padding: '0.5em 1em'
      link:
        fontSize: 18
        marginBottom: 5
    <tr>
      {false and (<td>{ @props.index + 1 }</td>)}
      <td style={ style.td }>
        <div style={ style.starsBar } />
        <div style= { style.inner }>
          <Link
            to={ 'projects' }
            params={{ id: @props.project._id }}
            style={ style.link }
          >
          { @props.project.name }
          </Link>
          { this.props.showDescription && (
            <p>{ @props.project.description }</p>
          )}
          { this.props.showTags && (
            <div>{ @props.project.tags.map( (tag, i) => <TagLabel tag={ tag } key={ i } /> ) }</div>
          )}
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
