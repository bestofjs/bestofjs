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
    // console.log('Render project list', this.props.projects.length);
    return (
      <div>
        {this.props.projects.map((project, index) =>
          <ProjectCard
            project={ project }
            maxStars={ this.props.maxStars }
            key={ index }
            index={ index }
            showTags={ this.props.showTags }
            showDescription={ this.props.showDescription }
            showStars={ this.props.showStars }
            showDelta={ this.props.showDelta}
            showURL={ this.props.showURL }
          />)
        }
      </div>
    );
  }
});
// export default ProjectList;
module.exports = ProjectList;
