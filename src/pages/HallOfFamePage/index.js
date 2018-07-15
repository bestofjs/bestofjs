import React from 'react'
import { connect } from 'react-redux'

import FetchHeroes from '../../containers/FetchHeroes'
import HoF from '../../components/hof/HeroList'
import { getAllHeroes } from '../../selectors/hall-of-fame'

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
function mapDispatchToProps(dispatch, props) {
  const { dependencies } = props
  const { authApi } = dependencies
  return {
    authActions: {
      login: authApi.login
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HallOfFamePage)
