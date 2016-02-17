import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = React.createClass({

  getDefaultProps() {
    return ({
      showTags: true,
      showDescription: true,
      showStars: true,
      showDelta: true,
      showURL: false
    });
  },

  onChangeText(e) {
    this.props.actions.changeText(e.target.value);
  },

  render() {
    return (
      <div>
        {this.props.projects.map((project, index) =>
          <ProjectCard
            { ...this.props }
            project={ project }
            maxStars={ this.props.maxStars }
            key={ index }
            index={ index }
          />)
        }
      </div>
    );
  }
});
// export default ProjectList;
module.exports = ProjectList;
