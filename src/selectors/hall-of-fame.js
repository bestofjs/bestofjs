import { createSelector } from 'reselect'

export const getAllHeroes = createSelector(
  state => state.entities.heroes,
  state => state.entities.projects,
  (heroesById, projectsById) => {
    return Object.values(heroesById).map(populateHero(projectsById))
  }
)

export const populateHero = projectsById => hero => {
  const projects = hero.projects.map(projectId => projectsById[projectId])
  return { ...hero, projects }
}

export const searchForHeroes = text =>
  createSelector(
    getAllHeroes,
    heroes => {
      return heroes.filter(filter(text)).slice(0, 10)
    }
  )

// Filter a user against a text query (used to filter array of heroes)
export const filter = text => hero => {
  const startsWith = new RegExp('^' + text, 'i')
  const contains = new RegExp(text, 'i')
  const re = text.length < 3 ? startsWith : contains
  if (re.test(hero.username)) return true
  if (re.test(hero.name)) return true
  if (re.test(hero.bio)) return true
  return false
}
