function checkDuplicate (values, projects) {
  const repo = `https://github.com/${values.project.value}`
  const found = Object.keys(projects)
    .map(key => projects[key])
    .find(project => project.repository === repo)
  if (found) return false
  return true
}

export default function validate (values, props) {
  const { projects } = props
  const errors = {}
  const requiredFields = [
    {
      name: 'project',
      message: 'Please select a project on Github'
    },
    {
      name: 'comment',
      message: 'Please explain in a few words why you want to add this project.'
    }
  ]
  requiredFields
    .filter(field => !values[field.name])
    .forEach(field => {
      errors[field.name] = field.message
    })

  if (values.project && !checkDuplicate(values, projects)) {
    errors.project = 'The project already exists!'
  }
  return errors
}
