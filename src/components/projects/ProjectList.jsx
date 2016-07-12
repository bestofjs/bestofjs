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
      <div className="project-grid">
        {this.props.projects.map((project, index) =>
          <div key={ project.id }>
            <ProjectCard
              project={ project }
              maxStars={ this.props.maxStars }
              index={ index }
              showTags={ this.props.showTags }
              showDescription={ this.props.showDescription }
              showStars={ this.props.showStars }
              showDelta={ this.props.showDelta}
              deltaFilter={ this.props.deltaFilter}
              showURL={ this.props.showURL }
              showMetrics={ this.props.showMetrics }
              viewOptions={this.props.viewOptions}
            />
          </div>)
        }
      </div>
    )
  }
})
export default ProjectList
