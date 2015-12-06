import React from 'react';
var Router = require('react-router');
var TagLabel = require('../tags/TagLabelCompact');
var Delta = require('../common/utils/Delta');
var DeltaBar = require('../common/utils/DeltaBar');
var Stars = require('../common/utils/Stars');
var Description = require('../common/utils/Description');

import fromNow from '../../helpers/fromNow';

var {Link} = Router;

const ProjectCard = React.createClass({
  render: function () {

    const { project, index } = this.props;
    const viewProjectURL = `/projects/${project.id}`;

    var style = {
      starsBar: {
        width: (project.stars * 100 / this.props.maxStars).toFixed() + '%'
      }
    };

    return (
      <div className="project-card">
        { this.props.maxStars && (
          <div className="stars-bar" style={ style.starsBar } />
        )}
        <div className="inner">


          <div className="ranking">
            { index + 1 }
          </div>

          <div className="big-numbers">
            { this.props.showStars && (
              <div className="total">
                <Stars
                  value={ project.stars }
                  icon={ true }
                />
              </div>
            )}

            {  this.props.showDelta && project.deltas.length > 0 && (
              <div className="delta">
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
            className="link"
          >
            { project.name }
          </Link>

          { this.props.showURL && project.url && (
            <a className="url" href={ project.url }>
              { project.url }
            </a>
          )}
          { this.props.showDescription && (
            <p>
              <Link
                to={ viewProjectURL }
                className="description"
              >
                <Description text={ project.description } />
              </Link>
            </p>
          )}
          { this.props.showTags && (
            <div className="tags">
              { project.tags.map( (tag, i) =>
                <TagLabel tag={ tag } key={ i } /> )
              }
            </div>
          )}

          <div className="last-commit">
            <span className="octicon octicon-git-commit"></span>
            {' '}
            Last update: { fromNow(project.pushed_at) }
          </div>

        </div>

        <div>
          { project.deltas.length > 0 && <DeltaBar data={ project.deltas.slice(0,7) } />}
        </div>

      </div>
    );

  }
});
//export default ProjectCard;
module.exports = ProjectCard;
