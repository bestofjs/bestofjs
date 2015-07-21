var React = require('react');
var Router = require('react-router');

var App = require('./components/App');
var Home = require('./components/home/Home');
var About = require('./components/about/About');
var ProjectPage = require('./components/projects/ProjectPage');
var AllProjectsPage = require('./components/projects/AllProjectsPage');
var TagPage = require('./components/tags/TagPage');
var {DefaultRoute, Route, Routes, Redirect} = Router;

require('./scripts/app');

require('./stylesheets/base.styl');
require('./stylesheets/table.styl');

var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var routes = (
  <Route name="root" handler={App} path="/">
    <DefaultRoute handler={Home}/>
    <Redirect from="/" to="home" />
    <Route name="home" handler={Home}/>
    <Route name="about" handler={About}/>
    <Route name="project-list" path="projects" handler={AllProjectsPage}/>
    <Route name="projects" path="projects/:id" handler={ProjectPage}/>
    <Route name="tags" path="tags/:id" handler={TagPage}/>
  </Route>

);

Router
  .run(routes, function (Handler, b) {
    console.log('Router', Handler, b);
    React.render(<Handler/>, document.getElementById('app'));
  });
