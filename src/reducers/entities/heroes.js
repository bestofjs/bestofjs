export default function (state = {}, action) {
  switch (action.type) {
    case 'FETCH_HEROES_SUCCESS':
      return action.payload.reduce(
        (acc, hero) => ({ ...acc, [hero.username]: hero }),
        {}
      )
    default:
      return state
  }
}
