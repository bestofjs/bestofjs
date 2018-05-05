import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FetchHeroes from './FetchHeroes'
import HoF from '../components/hof/HeroList'
import * as authActionCreators from '../actions/authActions'
import { getAllHeroes } from '../helpers/hof'

const getYou = auth => ({
  name: 'Could be you?',
  username: auth.username || '',
  followers: auth.followers || 0,
  avatar: auth.avatar || '',
  projects: [],
  bio: `${auth.name}, you will be the next shining star, keep up the good work!`
})

const HallOfFamePage = ({ you, auth, authActions, heroes }) => {
  return (
    <FetchHeroes>
      <HoF
        heroes={heroes}
        you={you}
        auth={auth}
        onLogin={authActions.login}
        isHero={false}
        showDetails
      />
    </FetchHeroes>
  )
}

const mapStateToProps = state => {
  const { auth } = state
  const allHeroes = getAllHeroes(state)
  return {
    heroes: allHeroes,
    auth,
    you: getYou(auth)
  }
}
function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActionCreators, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HallOfFamePage)
