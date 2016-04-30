// Helpers
import menu from '../helpers/menu';

function postNavigation() {
  // To be run after every page transition
  // on mobile screens, hide the side after a link has been clicked
  if (menu.open) menu.hide();
}

// Custom middleware to be run AFTER the router middleware
const navigationMiddleware = store => next => action => {
  if (!store.getState().routing) return next(action);
  const previousPage = store.getState().routing.path;
  const result = next(action);
  const nextPage = store.getState().routing.path;
  // console.info('navigation middleware', previousPage, ' => ', nextPage);
  if (previousPage !== nextPage) {
    postNavigation();
  }
  return result;
};

export default navigationMiddleware;
