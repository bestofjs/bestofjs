import React from 'react'
import { connect } from 'react-redux'

import createForm from '../components/user-requests/add-hero/AddHeroReduxForm'
import { addHero } from '../actions/repoActions'

const SubmitHeroPage = React.createClass({
  onSave (values, dispatch) {
    const { auth } = this.props
    return dispatch(addHero(values, auth))
  },
  render () {
    const { heroes } = this.props
    const Form = createForm(heroes)
    return (
      <Form
        onSave={this.onSave}
      />
    )
  }
})

function mapStateToProps (state) {
  const {
    entities: { heroes },
    auth
  } = state
  return {
    heroes,
    auth
  }
}

export default connect(mapStateToProps)(SubmitHeroPage)
