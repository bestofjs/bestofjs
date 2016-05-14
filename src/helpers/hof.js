// Return the `Hero` with populated projects
export const populate = allProjects => hero => {
  const projects = hero.projects.map(id => allProjects[id])
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
