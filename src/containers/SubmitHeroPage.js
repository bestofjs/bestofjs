import React from 'react'
import { connect } from 'react-redux'

import Form from '../components/user-requests/add-hero/AddHeroReduxForm'
import { addHero } from '../actions/repoActions'

const SubmitHeroPage = ({ heroes, auth }) => {
  const onSave = (values, dispatch) => {
    return dispatch(addHero(values, auth))
  }
  return (
    <Form
      onSave={onSave}
      heroes={heroes}
    />
  )
}

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
