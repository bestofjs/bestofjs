// Add `tag` full object to a project object that contains only an array of tag ids
// 2 examples of call:
// * In a map function applied to an array of projets `projects.map( populate(tags) );`
// * For a single project: `project = populate(tags)(project);`
export default function populate(tags) {
  return function (project) {
    const populated = Object.assign(project, {}, {
      tags: project.tagIds.map( id => tags[id] )
    });
    return populated;
  };
}
