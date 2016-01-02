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
  case 'GET_REVIEWS_SUCCESS':
    return addReviewIdsToProjects(state, action.data.results);
  case 'CREATE_REVIEW_SUCCESS':
    return addReviewIdsToProjects(state, [action.data]);
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

function addReviewIdsToProjects(projects0, reviews) {
  let projects1 = Object.assign({}, projects0);
  reviews.forEach(review => {
    const id = review.id || review.objectId;
    const projectId = review.project;
    const project = projects1[projectId];
    if (project) {
      const reviews0 = project.reviews;
      const reviews1 = reviews0 ? [id, ...reviews0] : [id]; // update the link id array or create it
      project.reviews = reviews1;
      projects1 = Object.assign({}, projects1, { projectId: project });
    } else {
      log('No project with the id', projectId);
    }
  });
  return projects1;
}
