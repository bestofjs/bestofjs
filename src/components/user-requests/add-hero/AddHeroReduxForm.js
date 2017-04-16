import { reduxForm } from 'redux-form'

import Form from './AddHeroForm'
import validate from './validate'

const ReduxForm = reduxForm({
  form: 'add-project',
  validate: validate
})(Form)

export default ReduxForm
