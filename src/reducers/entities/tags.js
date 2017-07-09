export default function (state = {}, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS_SUCCESS':
      return setTags(state, action.payload)
    default:
      return state
  }
}

function setTags (entities, payload) {
  const tagsByCode = payload.tags
    .reduce((acc, tag) => {
      return {...acc, [tag.code]: { ...tag, id: tag.code }}
    }, {})
  return tagsByCode
}
