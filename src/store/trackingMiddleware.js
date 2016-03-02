import trackEvent from '../helpers/track';


function track(path, params) {
  const id = params.id;
  switch (path) {
  case 'tags/:id':
    trackEvent('Filter tag', id);
    break;
  case 'projects/:id':
    track('View project', id);
    break;
  }
}

const trackingMiddleware = store => next => action => {
  if (!store.getState().router) return next(action);
  const result = next(action);
  const router = store.getState().router;
  const routes = router.routes;
  const lastRoute = routes[routes.length - 1];
  const path = lastRoute.path;
  const params = router.params;
  track(path, params);
  return result;
};
export default trackingMiddleware;
