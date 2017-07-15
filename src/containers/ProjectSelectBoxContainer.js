import React from 'react'
import { connect } from 'react-redux'
import ProjectSelectBox from '../components/common/form/ProjectSelectBox'

const ProjectSelectBoxContainer = props => {
  const { options } = props
  return <ProjectSelectBox options={options} {...props} />
}

function mapStateToProps(state) {
  const { entities: { projects } } = state

  const options = Object.keys(projects)
    .map(key => projects[key])
    .map(project => ({
      value: project.slug,
      label: project.name
    }))
  return {
    options
  }
}

export default connect(mapStateToProps, {})(ProjectSelectBoxContainer)
