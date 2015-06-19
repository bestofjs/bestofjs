React = require 'react'
Router = require 'react-router'
mui = require('material-ui')
TagMenu = require './TagMenu'
SortMenu = require './SortMenu'
flux = require('../../scripts/app')

require('../../stylesheets/project.styl')

{Link} = Router;
{ Paper, Toolbar, ToolbarGroup, DropDownMenu, TextField } = mui;

ProjectGrid = React.createClass

  onChangeText: (e) ->
    flux.actions.changeText e.target.value

  render: ->

    <div>

      <div className="row pure-g">
        <div className="pure-u-1-3 col s12 m4">
          <TagMenu tags={ this.props.tags } selectedTag={ this.props.selectedTag }/>
        </div>
        <div className="pure-u-1-3 col s12 m4">
          <SortMenu selectedSort={ this.props.selectedSort } />
        </div>
        <div className="pure-u-1-3 col s12 m4">
          <TextField
            value={ this.props.searchText }
            onChange={ this.onChangeText }
            hintText={ 'Enter text to search' }
          />
        </div>
      </div>

      {if false
        <Toolbar>
            <ToolbarGroup float="left">
              <TagMenu tags={ this.props.tags } selectedTag={ this.props.selectedTag }/>
            </ToolbarGroup>
            <ToolbarGroup float="left">
              <SortMenu selectedSort={ this.props.selectedSort } />
            </ToolbarGroup>
            <ToolbarGroup float="left">
              <TextField value={ this.props.searchText } onChange={ this.onChangeText } />
            </ToolbarGroup>
            <ToolbarGroup float="right">
              <span style={{ lineHeight: '56px', paddingRight: 20 }}>{this.props.projects.length} projects</span>
            </ToolbarGroup>
          </Toolbar>
        }

      <div className="row">
          {this.props.projects.map (project) ->
            <div className="col-sm-3" key={ project._id }>
              <ProjectGrid.Item project={ project } />
            </div>
          }
      </div>

    </div>


ProjectGrid.Item = React.createClass

  render: ->
    <div className="box card z-depth-2">
      <div className="card-content">

          <Link
            to={ 'projects' }
            params={{ id: @props.project._id }}
            className="card-title grey-text text-darken-4"
          >
            { this.props.project.name }
          </Link>

        <div>{ @props.project.stars } stars (+{ @props.project.delta1 } )</div>
        { @props.project.url and (
          <p>
            <a href={ @props.project.url }>{ 'website' }</a>
          </p>
        )}



      </div>
    </div>



module.exports = ProjectGrid
