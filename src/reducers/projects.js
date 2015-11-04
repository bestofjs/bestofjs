export function sortBy(projects, get, direction = 'DESC') {
  return projects.sort(function(a, b) {
    var diff;
    diff = get(a) - get(b);
    return diff * ((direction = 'DESC') ? -1 : 1);
  });
}

export function populateTagData(projects, tagsMap) {
  var projectsWithTags = projects.map(function (project) {
    const tags = project.tags.map( (tagId) => tagsMap[tagId] );
    return Object.assign({}, project, {tags: tags});
  });
  return projectsWithTags;
}
