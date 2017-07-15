import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

const ProjectSelectBox = ({ options, field }) => {
  const handleChange = items => {
    const values = items.map(item => item.value)
    field.onChange(values)
  }
  return (
    <div>
      <Select
        name="projects"
        value={field.value}
        options={options}
        multi
        onChange={handleChange}
      />
    </div>
  )
}

ProjectSelectBox.propTypes = {
  options: PropTypes.array.isRequired
}

export default ProjectSelectBox
