import fetchJSON from '../helpers/fetchJSON'
import api from '../../config/api'

function fetchHeroes() {
  const url = `${api('GET_PROJECTS')}hof.json`
  return dispatch => {
    return fetchJSON(url)
      .then(json => dispatch(fetchHeroesSuccess(json)))
    // .catch((response) => dispatch(getReadmeFailure(id, response)));
  };
}

export const fetchHeroesSuccess = json => ({
  type: 'FETCH_HEROES_SUCCESS',
  payload: json.heroes
});

export function fetchAllHeroes() {
  return fetchHeroes()
}
