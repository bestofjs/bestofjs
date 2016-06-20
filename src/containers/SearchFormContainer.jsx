import React from 'react'
import history from 'react-router/lib/browserHistory'

import SearchForm from '../components/home/SearchForm'

function emitChange(text) {
  if (text) {
    history.push(`/search/${text}`)
  } else {
    history.push('/')
  }
}

export default (props) => {
  const highlight = /search/.test(props.location && props.location.pathname)
  return (
    <SearchForm onChange={ emitChange } highlight={highlight} />
  )
}
