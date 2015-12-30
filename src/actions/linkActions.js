function createLinkRequest(link) {
  return {
    type: 'CREATE_LINK_REQUEST',
    link
  };
}
function createLinkSuccess(link) {
  return {
    type: 'CREATE_LINK_SUCCESS',
    data: {
      [link.id]: link
    }
  };
}

// Called by `LinkReduxForm`, when adding a link from the project tab
export function addLink(project, linkData, username) {
  const payload = Object.assign({}, linkData, {
    projects: [project.id],
    date: new Date().toISOString(),
    createdBy: username
  });
  return dispatch => {
    dispatch(createLinkRequest(payload));
    const p = new Promise(function (resolve) {
      setTimeout(function () {
        const id = (new Date()).getTime();
        const data = Object.assign({}, payload, {
          id
        });
        resolve(data);
      }, 1000);
    });
    return p
      .then(json => dispatch(createLinkSuccess(json)));
  };
}
