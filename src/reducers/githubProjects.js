export default function githubProjects(state, action) {
  if (!state) return {
    lastUpdate: new Date(),
    popularProjectIds: [],
    hotProjectIds: []
  };
  switch (action.type) {
  default:
    return state;
  }
}
