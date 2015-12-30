import log from '../../helpers/log';

export default function (state = {}, action) {
  switch (action.type) {
  case 'GET_README_SUCCESS':
    const project = Object.assign({}, state[action.id], {
      readme: action.data.readme
    });
    return Object.assign({}, state, {
      [action.id]: project
    });
  case 'GET_LINKS_SUCCESS':
  case 'CREATE_LINK_SUCCESS':
    const newLinks = action.data;
    return addLinkIdsToProjects(state, newLinks);
  default:
    return state;
  }
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
