const defaultState = {
  heroesById: []
}
export default function (state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_HEROES_SUCCESS':
      return ({
        heroesById: action.payload.map(hero => hero.username)
      })
    default:
      return state
  }
}
