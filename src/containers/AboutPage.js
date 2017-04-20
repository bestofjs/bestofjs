import React, { Component } from 'react'
import { connect } from 'react-redux'

import About from '../components/about/About'
import populate from '../helpers/populate'
import log from '../helpers/log'
import getStaticContent from '../staticContent'

class AboutPage extends Component {
  render () {
    log('Render the <AboutPage> container', this.props)
    const { staticContent, project, count, ui } = this.props
    return (
      <About
        project={project}
        staticContent={staticContent}
        count={count}
        ui={ui}
      />
    )
  }

}

function mapStateToProps (state) {
  const {
    entities: { projects, tags, links },
    githubProjects,
    ui
  } = state

  const project = githubProjects.total
    .map(id => projects[id])
    .slice(0, 1)
    .map(populate(tags, links))

  return {
    project: project[0],
    staticContent: getStaticContent(),
    count: Object.keys(projects).length,
    ui
  }
}

export default connect(mapStateToProps, {})(AboutPage)
