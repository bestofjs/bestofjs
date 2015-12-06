import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Home from './containers/HomePage';
import About from './containers/AboutPage';
import ProjectPage from './components/projects/ProjectPage';
import TagFilter from './components/home/TagFilter';
import TextFilter from './components/home/TextFilter';
import loading from './loading';

function getRoutes() {

  function onEnter(nextState, state) {
    loading.show();
  }

  var routes = (
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="home" component={Home}/>
      <Route path="about" component={About}/>
      <Route path="projects/:id" component={ProjectPage}/>
      <Route path="tags/:id" component={ TagFilter } onEnter={ onEnter } />
      <Route path="search/:text" component={ TextFilter }/>
    </Route>
  );
  return routes;
}

module.exports = getRoutes();
