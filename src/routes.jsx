import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import Home from './containers/HomePage';
import About from './containers/AboutPage';
import TagFilter from './containers/TagFilterPage';
import TextFilter from './containers/TextFilterPage';

// Single Project page
import ProjectPage from './containers/ProjectPage';
import ProjectLinks from './components/ProjectView/Links';
import ProjectLinksList from './components/ProjectView/Links/List';
import ProjectLinksAdd from './components/ProjectView/Links/Create';
import ProjectViewReadme from './components/ProjectView/Readme';
import ProjectViewReviews from './components/ProjectView/Reviews';

function getRoutes() {
  // function onEnter(nextState, state) {
  //   loading.show();
  // }
  const routes = (
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="home" component={Home}/>
      <Route path="about" component={About}/>
      <Route path="projects/:id" component={ProjectPage}>
        <IndexRoute component={ProjectViewReadme} />
        <Route path="links" component={ProjectLinks}>
          <IndexRoute component={ProjectLinksList} />
          <Route path="add" component={ProjectLinksAdd} />
        </Route>
        <Route path="readme" component={ProjectViewReadme} />
        <Route path="reviews" component={ProjectViewReviews} />
      </Route>
      <Route path="tags/:id" component={ TagFilter } />
      <Route path="search/:text" component={ TextFilter }/>
      <Redirect from="*" to="home" />
    </Route>
  );
  return routes;
}

module.exports = getRoutes();
