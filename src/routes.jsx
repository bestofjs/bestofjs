import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import Home from './containers/HomePage';
import About from './containers/AboutPage';
import TagFilter from './containers/TagFilterPage';
import ProjectPage from './containers/ProjectPage';
import TextFilter from './containers/TextFilterPage';

function getRoutes() {

  // function onEnter(nextState, state) {
  //   loading.show();
  // }

  var routes = (
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="home" component={Home}/>
      <Route path="about" component={About}/>
      <Route path="projects/:id" component={ProjectPage}/>
      <Route path="tags/:id" component={ TagFilter } />
      <Route path="search/:text" component={ TextFilter }/>
      <Redirect from="*" to="home" />
    </Route>
  );
  return routes;
}

module.exports = getRoutes();
