import React from 'react';
import { Link } from 'react-router';

import TagLabel from '../tags/TagLabelCompact';
import Delta from '../common/utils/Delta';
import DeltaBar from '../common/utils/DeltaBar';
import Stars from '../common/utils/Stars';
import Description from '../common/utils/Description';
import ProjectCardLink from './ProjectCardLink';

import fromNow from '../../helpers/fromNow';

const ProjectCard = React.createClass({
  render() {
    const { project, index, isLoggedin } = this.props;
    const viewProjectURL = `/projects/${project.id}`;

    const style = {
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
                  icon
                />
              </div>
            ) }

            { this.props.showDelta && project.deltas.length > 0 && (
              <div className="delta">
                <Delta
                  value={ project.deltas[0] }
                  big
                  icon
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
              { project.tags.map(tag =>
                <TagLabel tag={ tag } key={ project.id + tag.id } />
              ) }
            </div>
          )}

        </div>

        {false && <div className="inner reviews" style={{ borderTop: '1px solid #ddd' }}>
          <header>Reviews</header>
        </div>}

        <ProjectCardLink
          links={ project.links || [] }
          isLoggedin={ isLoggedin }
        />

        <div className="inner github" style={{ borderTop: '1px solid #ddd', paddingBottom: 0 }}>
          <header style={{ marginBottom: '0.5em' }}>On Github</header>
          <div className="last-commit">
            <span className="octicon octicon-git-commit"></span>
            {' '}
            Last update: { fromNow(project.pushed_at) }
          </div>
          <div>
            { project.deltas.length > 0 && <DeltaBar data={ project.deltas.slice(0, 7) } />}
          </div>
        </div>


      </div>
    );
  }
});
// export default ProjectCard;
module.exports = ProjectCard;
