export function sortBy(projects, get, direction = 'DESC') {
  return projects.sort(function(a, b) {
    var diff;
    diff = get(a) - get(b);
    return diff * ((direction = 'DESC') ? -1 : 1);
  });
}
