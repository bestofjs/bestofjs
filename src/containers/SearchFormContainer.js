import React from 'react'
import { withRouter } from 'react-router-dom'

import SearchForm from '../components/home/SearchForm'

const emitChange = history => text => {
  if (text) {
    history.push(`/search/${text}`)
  } else {
    history.push('/')
  }
}

const SearchFormContainer = props => {
  const onChange = emitChange(props.history)
  const highlight = /search/.test(props.location && props.location.pathname)
  return <SearchForm onChange={onChange} highlight={highlight} />
}

export default withRouter(SearchFormContainer)
