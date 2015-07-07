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
    showStars: true
    showDelta: false


  onChangeText: (e) ->
    flux.actions.changeText e.target.value

  render: ->

    <div>
      {this.props.projects.map (project, index) =>
        <ProjectList.Item
          project={ project }
          maxStars={ this.props.maxStars }
          key={ project._id }
          index={ index }
          {...this.props}
        />
      }
    </div>


ProjectList.Item = React.createClass
  render: ->
    style =
      container:
        marginBottom: 10
        padding: 0
        backgroundColor: 'white'
        verticalAlign: 'top'
        border: '1px solid #cbcbcb'
      starsBar:
        height: 3
        backgroundColor: Colors.amber200
        width: (@props.project.stars * 100 / @props.maxStars).toFixed() + '%'
      inner:
        padding: '0.5em 1em'
      link:
        fontSize: 18
        marginBottom: 5
    <div style={ style.container }>
      <div style={ style.starsBar } />
      <div style= { style.inner }>

        <div style={{ float: 'right' }}>
          { @props.showStars && (
            <div style={{ fontSize: 24 }}>
              <Stars value={ @props.project.stars } />
            </div>
          )}

          {  @props.showDelta && (
            <div style={{ fontSize: 16 }}>
              <Delta value={  @props.project.delta1 } />
            </div>
          ) }

        </div>

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



    </div>


module.exports = ProjectList
