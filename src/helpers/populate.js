export default  function populate(tags, project) {
  console.log('populate', project, tags);
  return function (project) {
    return Object.assign(project, {}, {
      tags: project.tagIds.map( id => ({
        name: tags[id].name,
        id: id
      }) )
    });
  };
}
