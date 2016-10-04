import { idToProject } from './projectHelpers'

// Return an array containing all Hall of Fame members, with their populated projects
// Used in the container component and in test files.
export function getAllHeroes (state) {
  return state.hof.heroesById
    .map(id => state.entities.heroes[id])
    .map(populate(state))
}

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
