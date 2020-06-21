import { createContainer } from 'unstated-next'
import { useAsync } from 'react-async'

import api from 'api/config'
import { fetchJSON } from 'helpers/fetch'
import { ProjectDataContainer } from './project-data-container'

export function useHallOfFame() {
  const { data, ...rest } = useAsync({ promiseFn: fetchHeroes })
  if (!data) return rest
  const {
    entities: { projects: projectsById }
  } = ProjectDataContainer.useContainer()
  const heroes = data.map(populateHero(projectsById))
  return { heroes, ...rest }
}

export const HallOfFameContainer = createContainer(useHallOfFame)

function fetchHeroes() {
  const url = `${api('GET_PROJECTS')}/hof.json`
  return fetchJSON(url).then(data => data.heroes)
}

export const populateHero = projectsById => hero => {
  const projects = hero.projects.map(projectId => projectsById[projectId])
  return { ...hero, projects }
}
