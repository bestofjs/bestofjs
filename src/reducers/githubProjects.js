// Helpers
import log from '../helpers/log';

export default function githubProjects(state, action) {
  log('Running the reducer', action.type);
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
