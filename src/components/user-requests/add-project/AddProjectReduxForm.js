import { reduxForm } from 'redux-form'

import Form from './AddProjectForm'
import validate from './validate'

const createReduxForm = projects => (
  reduxForm({
    form: 'add-project',
    // fields: ['project', 'comment'],
    validate: validate(projects)
  })(Form)
)

export default createReduxForm
