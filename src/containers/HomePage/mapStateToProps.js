import populate from '../../helpers/populate'

function mapStateToProps (state, count) {
  const {
    entities: {
      projects,
      tags,
      links
    },
    githubProjects,
    auth,
    ui
  } = state

  const key = ui.hotFilter // 'daily' or 'weekly'
  const hot = githubProjects[key]
    .map(id => projects[id])
    .slice(0, count) // display only the 20 hottest projects
    .map(populate(tags, links))
  const popularProjects = githubProjects.total
    .map(id => projects[id])
    .slice(0, count) // display the "TOP20"
    .map(populate(tags, links))
  const allTags = githubProjects.tagIds.map(id => tags[id])
  const popularTags = allTags
    .slice()
    .sort((a, b) => b.counter > a.counter ? 1 : -1)
    .slice(0, 10)

  return {
    hotProjects: hot,
    popularProjects,
    popularTags,
    auth,
    ui
  }
}

export default mapStateToProps
