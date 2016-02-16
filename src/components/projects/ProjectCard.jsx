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
  renderReviews(reviews = []) {
    const count = reviews.length;
    const text = (count === 1) ? 'One review' : `${count} reviews`;
    return (
      <section>
        <span className="octicon octicon-heart"></span>
        {text}
      </section>
    );
  },
  renderLinks(links = []) {
    const count = links.length;
    const text = (count === 1) ? 'One link' : `${count} links`;
    return (
      <section>
        <span className="octicon octicon-link"></span>
        { text }
      </section>
    );
  },
  render() {
    const { project, index, isLoggedin } = this.props;
    const path = `/projects/${project.id}`;

    return (
      <div className="project-card">
        <Link
          to={ path }
          className="card-block"
        >
          <header>
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

            <div
              className="title"
            >
              { project.name }
            </div>
          </header>

          { this.props.showDescription && (
            <section>
              <Description text={ project.description } />
            </section>
          )}

        </Link>

        { this.props.showTags && (
          <section className="tags-section">
            { project.tags.map(tag =>
              <TagLabel tag={ tag } key={ project.id + tag.id } />
            ) }
          </section>
        )}

        {project.reviews &&
          <Link
            className="card-block"
            to={`${path}/reviews`}
          >
            {this.renderReviews(project.reviews)}
          </Link>
        }

        {project.links &&
          <Link
            className="card-block"
            to={`${path}/links`}
          >
            {this.renderLinks(project.links)}
          </Link>
        }

        <div className="inner github">
          <div className="last-commit">
            <span className="octicon octicon-git-commit"></span>
            {' '}
            Last update: { fromNow(project.pushed_at) }
          </div>
            { project.deltas.length > 0 && <DeltaBar data={ project.deltas.slice(0, 7) } />}
        </div>
      </div>
    );
  }
});
// export default ProjectCard;
module.exports = ProjectCard;
