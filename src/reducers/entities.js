export default function entities(state, action) {
  if(!state) return {
    projects: {},
    tags: {}
  };
  switch (action.type) {
    case 'GET_README_SUCCESS':
    case 'GET_README_FAILURE':
      const id = action.id;
      const projects = Object.assign({}, state.projects);
      const currentProject = Object.assign({}, projects[id]);
      currentProject.readme = action.data.readme;
      const newState = Object.assign({}, state);
      newState.projects[id] = currentProject;
      return newState;
  }
  return state;
}
