import intersection from 'lodash/array/intersection';

export default function filterProjects(projects, tags, text) {
  //debugger
  const matchingTags = text.length > 2 ? (
    tags
      .filter(tag => (
        (new RegExp(text, 'i')).test(tag.name)
      ))
      .map(tag => tag.id)
  ) : [];
  console.info('matching TAGS', text, matchingTags);

  return projects
    .map(p => Object.assign({}, p, {
      rank: rank(p, matchingTags, text)
    }))
    .filter(p => p.rank > 0)
    .sort((a, b) => a.rank > b.rank ? -1 : 1);
}

function rank(project, tags, text) {
  // if only one letter is entered, we search projects whose name start by the letter

  const re1 = new RegExp('^' + text, 'i');
  const re2 = new RegExp(text, 'i');

  if (re1.test(project.name)) {
    return 3;
  }
  if (text.length > 1) {
    if (re2.test(project.name)) {
      return 2;
    }
  }

  const matchingTags = intersection(tags, project.tags);
  if (matchingTags.length > 0) {
    return 2;
  }

  if (text.length > 2) {
    if (re2.test(project.description)) {
      return 1;
    }
    if (re2.test(project.repository)) {
      return 1;
    }
    if (re2.test(project.url)) {
      return 1;
    }
  }
  return 0;
}
