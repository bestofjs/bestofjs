var React = require('react');
var Router = require('react-router');
var TagLabel = require('../tags/TagLabelCompact');
var Delta = require('../common/utils/Delta');
var DeltaBar = require('../common/utils/DeltaBar');
var Stars = require('../common/utils/Stars');
var Description = require('../common/utils/Description');

import fromNow from '../../helpers/fromNow';

var {Link} = Router;

var ProjectList = React.createClass({

  getDefaultProps: function () {
    return ({
      showTags: true,
      showDescription: true,
      showStars: true,
      showDelta: true,
      showURL: false
    });
  },

  onChangeText: function (e) {
    this.props.actions.changeText( e.target.value);
  },

  render: function () {
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

    const { project, index } = this.props;
    const viewProjectURL = `/projects/${project._id}`;

    var style = {
      container: {
        marginBottom: 15,
        padding: 0,
        backgroundColor: 'white',
        verticalAlign: 'top',
        border: '1px solid #cbcbcb',
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16)'
      },
      starsBar: {
        height: 3,
        backgroundColor: '#ffe082',
        width: (project.stars * 100 / this.props.maxStars).toFixed() + '%'
      },
      inner: {
        padding: '1em 1em 0.5em',
        position: 'relative'
      },
      ranking: {
        position: 'absolute',
        top: -10,
        left: 15,
        color: '#ccc',
        fontSize: 64,
        letterSpacing: -10
      },
      link: {
        fontSize: '1.2em',
        marginBottom: 5,
        paddingLeft: 20,
        zIndex:2,
        position: 'relative',
        display: 'block',
        textAlign: 'center'
      }
    };

    return (
      <div className="card">
        <div style={ style.starsBar } />
        <div style= { style.inner }>

          {true && (
            <div style={ style.ranking }>
              { index + 1 }
            </div>
          )}

          <div style={{ float: 'right' }}>
            { this.props.showStars && (
              <div style={{ fontSize: '1.2em' }}>
                <Stars
                  value={ project.stars }
                  icon={ true }
                />
              </div>
            )}

            {  this.props.showDelta && project.deltas.length > 0 && (
              <div style={{ fontSize: 16 }}>
                <Delta
                  value={ project.deltas[0] }
                  big={ true }
                  icon={ true }
                />
              </div>
            ) }

          </div>

          <Link
            to={ viewProjectURL }
            style={ style.link }
          >
            { project.name }
          </Link>

          { this.props.showURL && project.url && (
            <a style={{ display: 'block', marginTop: '1em' }} href={ project.url }>
              { project.url }
            </a>
          )}
          { this.props.showDescription && (
            <p style={{ zIndex:2, position: 'relative' }}>
              <Link
                to={ viewProjectURL }
                className="description"
              >
                <Description text={ project.description } />
              </Link>
            </p>
          )}
          { this.props.showTags && (
            <div style={{ marginBottom: 5 }}>
              { project.tags.map( (tag, i) =>
                <TagLabel tag={ tag } key={ i } /> )
              }
            </div>
          )}

          <div style={{ marginTop: '1em'}}>
            <span className="octicon octicon-git-commit"></span>
            {' '}
            Last push: { fromNow(project.pushed_at) }
          </div>

        </div>


        <div>
          { project.deltas.length > 0 && <DeltaBar data={ project.deltas.slice(0,7) } />}
        </div>

      </div>
    );

  }
});

module.exports = ProjectList;
