import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = React.createClass({

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
          <ProjectCard
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
module.exports = ProjectList;
//export default ProjectList;
