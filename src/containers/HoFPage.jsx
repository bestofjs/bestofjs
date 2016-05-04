import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as authActionCreators from '../actions/authActions';
import HoF from '../components/hof/HeroList'

const getYou = (auth) => ({
  name: auth.name, // ? `Maybe you, ${auth.name}?` : 'Maybe you?',
  username: auth.username || '',
  followers: auth.followers || 0,
  avatar: auth.avatar || '',
  projects: [],
  bio: 'You will be the next shining star, keep up the good work!'
})

const Page = ({ heroes, auth, you, authActions, isHero }) => (
  <HoF
    heroes={heroes}
    you={you}
    auth={auth}
    onLogin={authActions.login}
    isHero={isHero}
  />
)

// Return the `Hero` with populated projects
const populate = (allProjects) => hero => {
  const projects = hero.projects.map(id => allProjects[id]);
  return Object.assign({}, hero, { projects });
}

function mapStateToProps(state) {
  const {
    entities: { heroes, projects },
    auth
  } = state
  const allHeroes = state.hof.heroesById
    .map(id => heroes[id])
    .map(hero => populate(projects)(hero))

  // Is the current user a Hall of Famer ?
  const isHero = state.hof.heroesById.filter(id => id === auth.username)

  return {
    heroes: allHeroes,
    auth,
    you: getYou(auth),
    isHero
  }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
