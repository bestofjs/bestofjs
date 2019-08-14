import { fetchJSON } from '../helpers/fetch'
import api from '../api/config'

function fetchHeroes() {
  const url = `${api('GET_PROJECTS')}hof.json`
  return dispatch => {
    dispatch(fetchHeroesRequest())
    return fetchJSON(url).then(json => dispatch(fetchHeroesSuccess(json)))
  }
}

export const fetchHeroesRequest = json => ({
  type: 'FETCH_HEROES_REQUEST'
})

export const fetchHeroesSuccess = json => ({
  type: 'FETCH_HEROES_SUCCESS',
  payload: json.heroes
})

export function fetchAllHeroes() {
  return fetchHeroes()
}
