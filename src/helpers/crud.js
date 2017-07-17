// Transform a given payload, applying the given function
// the payload can be:
// - an array of items (`results` key) or
// - a single item (no key)
export function convertPayload(payload, fn) {
  return Array.isArray(payload) ? payload.map(fn) : fn(payload)
}

// Transform project field for a given item, applying the given funcion fn
// project can be:
// - an array of project (`projects` field) or
// - a single project (`project`)
export const convertItem = fn => item => {
  if (item.projects)
    return Object.assign({}, item, {
      projects: item.projects.map(fn)
    })
  return Object.assign({}, item, {
    project: fn(item.project)
  })
}
