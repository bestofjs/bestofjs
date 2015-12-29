// Add `tag` full object to a project object that contains only an array of tag ids
// 2 examples of call:
// * In a map function applied to an array of projets `projects.map( populate(tags) );`
// * For a single project: `project = populate(tags)(project);`
export default function populate(tags, links) {
  return function (project) {
    if (!project) throw new Error('populate() called with NO PROJECT!');
    const populated = Object.assign({}, project, {
      tags: project.tags.map(id => tags[id]),
      links: (links && project.links) ? project.links.map(id => links[id]) : project.links,
    });
    return populated;
  };
}
