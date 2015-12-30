import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import Home from './containers/HomePage';
import About from './containers/AboutPage';
import TagFilter from './containers/TagFilterPage';
import TextFilter from './containers/TextFilterPage';

// Single Project page
import ProjectPage from './containers/ProjectPage';
import ProjectLinksTab from './components/ProjectView/LinksTab';
import ProjectLinksList from './components/ProjectView/LinksTab/List';
import ProjectLinksAdd from './components/ProjectView/LinksTab/Create';
import ProjectGithubTab from './components/ProjectView/GithubTab';
import ProjectReviewsTab from './components/ProjectView/ReviewsTab';

const Routes = () => (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="home" component={Home}/>
    <Route path="about" component={About}/>
    <Route path="projects/:id" component={ProjectPage}>
      <IndexRoute component={ProjectGithubTab} />
      <Route path="links" component={ProjectLinksTab}>
        <IndexRoute component={ProjectLinksList} />
        <Route path="add" component={ProjectLinksAdd} />
      </Route>
      <Route path="readme" component={ProjectGithubTab} />
      <Route path="reviews" component={ProjectReviewsTab} />
    </Route>
    <Route path="tags/:id" component={ TagFilter } />
    <Route path="search/:text" component={ TextFilter }/>
    <Redirect from="*" to="home" />
  </Route>
);

export default Routes;
