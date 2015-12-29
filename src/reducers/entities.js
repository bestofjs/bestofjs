import log from '../helpers/log';

export default function entities(state, action) {
  if (!state) return {
    projects: {},
    tags: {}
  };
  const projects = Object.assign({}, state.projects);
  switch (action.type) {
  case 'GET_README_SUCCESS':
  case 'GET_README_FAILURE':
    const currentProject = Object.assign({}, projects[action.id]);
    currentProject.readme = action.data.readme;
    const newState = Object.assign({}, state);
    newState.projects[action.id] = currentProject;
    return newState;
  case 'GET_LINKS_SUCCESS':
    const newLinks = action.data;
    // const links = Object.assign({}, state.links);
    return Object.assign({}, state, {
      links: newLinks,
      projects: addLinkIdsToProjects(state.projects, newLinks)
    });
  }

  return state;
}


// A "link" object can be associated to N projects
// This function loops through projects and update the ".links" property
function addLinkIdsToProjects(projects0, links) {
  // debugger;
  const linkIds = Object.keys(links);
  let projects1 = Object.assign({}, projects0);
  linkIds.forEach(id => {
    const link = links[id];
    const projectIds = link.projects; // get the array of project ids
    projectIds.forEach(projectId => {
      const project = projects1[projectId];
      if (project) {
        const links0 = project.links;
        const links1 = links0 ? [id, ...links0] : [id]; // update the link id array or create it
        project.links = links1;
        projects1 = Object.assign({}, projects1, { projectId: project });
      } else {
        log('No project with the id', projectId);
      }
    });
  });
  return projects1;
}
