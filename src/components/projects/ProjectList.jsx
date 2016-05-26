import React from 'react'
import ProjectCard from './ProjectCard'

const ProjectList = React.createClass({

  getDefaultProps() {
    return ({
      showTags: true,
      showDescription: true,
      showStars: true,
      showDelta: true,
      showURL: false,
      showMetrics: true
    })
  },

  render() {
    // console.info('Render project list', this.props.projects.length, this.props.showMetrics)
    return (
      <div>
        {this.props.projects.map((project, index) =>
          <ProjectCard
            project={ project }
            maxStars={ this.props.maxStars }
            key={ project.id }
            index={ index }
            showTags={ this.props.showTags }
            showDescription={ this.props.showDescription }
            showStars={ this.props.showStars }
            showDelta={ this.props.showDelta}
            deltaFilter={ this.props.deltaFilter}
            showURL={ this.props.showURL }
            showMetrics={ this.props.showMetrics }
          />)
        }
      </div>
    )
  }
})
export default ProjectList
