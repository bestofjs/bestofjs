export default function (state = {}, action) {
  switch (action.type) {
  case 'FETCH_HEROES_SUCCESS':
    const state1 = Object.assign({}, state)
    action.payload.forEach(hero => {
      state1[hero.username] = hero
    })
    return state1
  default:
    return state
  }
}
