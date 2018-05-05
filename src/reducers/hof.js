const defaultState = {
  heroesById: [],
  loading: false
}
export default function(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_HEROES_REQUEST':
      return {
        ...state,
        loading: true
      }
    case 'FETCH_HEROES_SUCCESS':
      return {
        ...state,
        loading: false,
        heroesById: action.payload.map(hero => hero.username)
      }
    default:
      return state
  }
}
