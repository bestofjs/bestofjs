// For a given project, return a key
// to be used in the entities state and in the project URLs
// Rule: use the project `name`, replacing spécial characters by '-'
export default function getProjectId(project) {
  return project.name.toLowerCase().replace(/[^a-z._\-0-9]+/g, '-')
}
