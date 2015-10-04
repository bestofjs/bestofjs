var React = require('react');
var Router = require('react-router');

var App = require('./App');
var Home = require('./home/Home');
var About = require('./about/About');
var ProjectPage = require('./projects/ProjectPage');
var AllProjectsPage = require('./projects/AllProjectsPage');
var TagFilter = require('./home/TagFilter');
var TextFilter = require('./home/TextFilter');
var ErrorMessage = require('./common/utils/ErrorMessage');
var {DefaultRoute, Route, Redirect} = Router;

var app = require('../scripts/app');

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
    <Route name="tags" path="tags/:id" handler={ TagFilter }/>
    <Route name="search" path="search/:text" handler={ TextFilter }/>
  </Route>

);

app.start( function (err, data) {
  var node = document.getElementById('app');
  //Setup content about bestof.js.org so that it can be used in any page (homepage, about...)
  var staticContent = {
    projectName: 'bestof.js.org',
    repo: 'https://github.com/michaelrambeau/bestofjs-webui'
  };
  if (err) {
    React.render(<ErrorMessage text={ err.message } />, node);
    return false;
  }
  Router.run(routes, function (Handler) {
    React.render(
      <Handler data={ data } staticContent={ staticContent }/>,
      node);
  });
});
