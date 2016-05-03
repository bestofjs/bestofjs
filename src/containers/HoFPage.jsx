import React from 'react'
import { connect } from 'react-redux'

import HoF from '../components/hof'

const Page = ({ heroes }) => (
  <HoF heroes={heroes} />
)

// Return the `Hero` with populated projects
const populate = (allProjects) => hero => {
  const projects = hero.projects.map(id => allProjects[id]);
  return Object.assign({}, hero, { projects });
};

function mapStateToProps(state) {
  const {
    entities: { heroes, projects }
  } = state
  const allHeroes = state.hof.heroesById
    .map(id => heroes[id])
    .map(hero => populate(projects)(hero))
  return {
    heroes: allHeroes
  }
}

export default connect(mapStateToProps)(Page);
