import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as authActionCreators from '../actions/authActions'
import HoF from '../components/hof/HeroList'
import { getAllHeroes } from '../helpers/hof'

const getYou = auth => ({
  name: 'Could be you?',
  username: auth.username || '',
  followers: auth.followers || 0,
  avatar: auth.avatar || '',
  projects: [],
  bio: `${auth.name}, you will be the next shining star, keep up the good work!`
})

const Page = ({ heroes, auth, you, authActions, isHero }) => (
  <HoF
    heroes={heroes}
    you={you}
    auth={auth}
    onLogin={authActions.login}
    isHero={isHero}
    showDetails
  />
)

function mapStateToProps(state) {
  const { entities: { heroes }, auth, ui } = state

  const allHeroes = getAllHeroes(state)

  // Is the current user a Hall of Famer ?
  const isHero = !!heroes[auth.username]

  return {
    heroes: allHeroes,
    auth,
    you: getYou(auth),
    isHero,
    ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
