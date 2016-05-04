import React from 'react'
import { connect } from 'react-redux'

import HoF from '../components/hof/HeroList'

const getYou = (auth) => ({
  name: auth.name ? `Maybe you, ${auth.name}?` : 'Maybe you?',
  username: auth.username || '',
  followers: auth.followers || 0,
  avatar: auth.avatar || '',
  projects: [],
  bio: 'You will be the next shining star, keep up the good work!'
})

const Page = ({ heroes, auth, you }) => (
  <HoF
    heroes={heroes}
    you={you}
    auth={auth}
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
  return {
    heroes: allHeroes,
    auth,
    you: getYou(auth)
  }
}

export default connect(mapStateToProps)(Page);
