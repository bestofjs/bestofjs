import React from 'react';
import { Link } from 'react-router';

import TagLabel from '../tags/TagLabelCompact';
import Delta from '../common/utils/Delta';
import DeltaBar from '../common/utils/DeltaBar';
import Stars from '../common/utils/Stars';
import Description from '../common/utils/Description';

import fromNow from '../../helpers/fromNow';

const renderReviews = (reviews = []) => {
  const count = reviews.length;
  const text = (count === 1) ? 'One review' : `${count} reviews`;
  return (
    <section>
      <span className="octicon octicon-heart"></span>
      {text}
    </section>
  );
};

const renderLinks = (links = []) => {
  const count = links.length;
  const text = (count === 1) ? (
    `one link: ${links[0].title}`
  ) : (
    `${count} links:`
  );
  const list = () => (
    <ul>
      {links.map(link => (
        <li>{link.title}</li>
      ))}
    </ul>
  );
  return (
    <section>
      <span className="octicon octicon-link"></span>
      {text}
      {count > 1 && list()}
    </section>
  );
};

const ProjectCard = (props) => {
  const { project, index /* , isLoggedin */ } = props;
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
            { props.showStars && (
              <div className="total">
                <Stars
                  value={ project.stars }
                  icon
                />
              </div>
            ) }

            { props.showDelta && project.deltas.length > 0 && (
              <div className="delta">
                <Delta
                  value={ project.deltas[0] }
                  big
                  icon
                />
              </div>
            ) }
          </div>
          <div className="title">
            { project.name }
          </div>
        </header>

        { props.showDescription && (
          <section>
            <Description text={ project.description } />
          </section>
        )}

      </Link>

      { props.showTags && (
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
          {renderReviews(project.reviews)}
        </Link>
      }

      {project.links &&
        <Link
          className="card-block"
          to={`${path}/links`}
        >
          {renderLinks(project.links)}
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
};

export default ProjectCard;
