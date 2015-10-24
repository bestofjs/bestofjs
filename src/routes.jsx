var React = require('react');
var ReactRouter = require('react-router');
var {Router, Route, IndexRoute} = ReactRouter;

var App = require('./containers/App');
var Home = require('./components/home/Home');
var About = require('./components/about/About');
var ProjectPage = require('./components/projects/ProjectPage');
var TagFilter = require('./components/home/TagFilter');
var TextFilter = require('./components/home/TextFilter');
var ErrorMessage = require('./components/common/utils/ErrorMessage');

var routes = (
  <Router>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="home" component={Home}/>
      <Route path="about" component={About}/>
      <Route path="projects/:id" component={ProjectPage}/>
      <Route path="tags/:id" component={ TagFilter }/>
      <Route path="search/:text" component={ TextFilter }/>
    </Route>
  </Router>
);
module.exports = routes;
