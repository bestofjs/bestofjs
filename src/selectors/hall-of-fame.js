import { createSelector } from 'reselect'

import { idToProject } from '../helpers/projectHelpers'

export const getAllHeroes = createSelector(
  state => state.entities.heroes,
  state => state,
  (heroesById, state) => {
    return Object.values(heroesById).map(populate(state))
  }
)

export const searchForHeroes = text =>
  createSelector(getAllHeroes, heroes => {
    return heroes.filter(filter(text)).slice(0, 10)
  })

// Return the `Hero` with populated projects
export const populate = state => hero => {
  const projects = hero.projects.map(idToProject(state))
  return Object.assign({}, hero, { projects })
}

// Filter a user against a text query (used to filter array of heroes)
export const filter = text => hero => {
  const startsWith = new RegExp('^' + text, 'i')
  const contains = new RegExp(new RegExp(text, 'i'))
  const re = text.length < 3 ? startsWith : contains
  if (re.test(hero.username)) return true
  if (re.test(hero.name)) return true
  if (re.test(hero.bio)) return true
  return false
}
