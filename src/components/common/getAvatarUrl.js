export default function getProjectAvatarUrl(project, size) {
  const githubAvatarUrl = `https://avatars.githubusercontent.com/u/${project.owner_id}?v=3&s=${size}`
  const url = project.icon || githubAvatarUrl
  return url
}
