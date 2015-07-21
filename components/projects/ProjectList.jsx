var React = require('react');
var Router = require('react-router');
var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var TagMenu = require('./TagMenu');
var TagLabel = require('../tags/TagLabelCompact');
var SortMenu = require('./SortMenu');
var flux = require('../../scripts/app');
var Delta = require('../common/utils/Delta');
var DeltaBar = require('../common/utils/DeltaBar');
var Stars = require('../common/utils/Stars');

//var lines = require('react-sparklines');
//var { Sparklines, SparklinesBars, SparklinesLine } = lines;

var {Link} = Router;
var { Paper, Toolbar, ToolbarGroup, DropDownMenu, TextField } = mui;

var ProjectList = React.createClass({

  getDefaultProps: function () {
    return ({
      showTags: true,
      showDescription: false,
      showStars: true,
      showDelta: true
    });
  },

  onChangeText: function (e) {
    flux.actions.changeText( e.target.value);
  },

  render: function (argument) {
    return(
      <div>
        {this.props.projects.map( (project, index) =>
          <ProjectList.Item
            { ...this.props }
            project={ project }
            maxStars={ this.props.maxStars }
            key={ project._id }
            index={ index }
          />)
        }
      </div>
    );
  }

});


ProjectList.Item = React.createClass({
  render: function () {
    var style = {
      container: {
        marginBottom: 15,
        padding: 0,
        backgroundColor: 'white',
        verticalAlign: 'top',
        border: '1px solid #cbcbcb'
      },
      starsBar: {
        height: 3,
        backgroundColor: Colors.amber200,
        width: (this.props.project.stars * 100 / this.props.maxStars).toFixed() + '%'
      },
      inner: {
        padding: '0.5em 1em'
      },
      link: {
        fontSize: 18,
        marginBottom: 5
      }
    };
    var project = this.props.project;
    return (
      <div style={ style.container }>
        <div style={ style.starsBar } />
        <div style= { style.inner }>

          <div style={{ float: 'right' }}>
            { this.props.showStars && (
              <div style={{ fontSize: 24 }}>
                <Stars value={ this.props.project.stars } />
              </div>
            )}

            {  this.props.showDelta && (
              <div style={{ fontSize: 16 }}>
                <Delta value={  this.props.project.delta1 } />
              </div>
            ) }

          </div>

          <Link
            to={ 'projects' }
            params={{ id: this.props.project._id }}
            style={ style.link }
          >
          { this.props.project.name }
          </Link>
          { this.props.showDescription && (
            <p>{ this.props.project.description }</p>
          )}
          { this.props.showTags && (
            <div>
              { this.props.project.tags.map( (tag, i) =>
                <TagLabel tag={ tag } key={ i } /> )
              }
            </div>
          )}
        </div>

        <div>
          <DeltaBar data={ project.deltas.slice(0,7) } />
          { false && (<Sparklines data={ project.deltas } width={ 400 }>
            <SparklinesBars color="blue" />
          </Sparklines>)}
        </div>

      </div>
    );

  }
});

module.exports = ProjectList;
