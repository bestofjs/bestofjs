// Helpers
import loading from '../helpers/loading';
import menu from '../helpers/menu';

function postNavigation() {
  // To be run after every page transition
  // console.info('post nav hook!');

  // navigate to the top of the screen when a route changes
  window.scrollTo(0, 0);

  // Hide the loading indicator
  loading.hide();

  // on mobile screens, hide the side after a link has been clicked
  if (menu.open) menu.hide();
}

// Custom middleware to be run AFTER the router middleware
const navigationMiddleware = store => next => action => {
  if (!store.getState().router) return next(action);
  const previousPage = store.getState().router.location.pathname;
  const result = next(action);
  const nextPage = store.getState().router.location.pathname;
  // console.info('navigation middleware', previousPage, ' => ', nextPage);
  if (previousPage !== nextPage) {
    postNavigation();
  }
  return result;
};

export default navigationMiddleware;
