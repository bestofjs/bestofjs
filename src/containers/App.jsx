import React from 'react';
//import PureRenderMixin from 'react-addons-pure-render-mixin';

import Sidebar  from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import menu from '../menu';
import log from '../helpers/log';


import { connect } from 'react-redux';
//import { pushState } from 'redux-router';

import * as actions from '../actions';

import { bindActionCreators } from 'redux';

// Return the current tag id (if current path is /tags/:id) or '*'
function getCurrentTagId(state) {
  const router = state.router;
  const route = router.routes[1].path;
  return route === 'tags/:id' ? router.params.id : '*';
}

// require *.styl intructions have been moved from components to the App.jsx container
// to be able to run tests with node.js

function hideSplashScreen() {
  var elements = document.querySelectorAll('.nojs');
  Array.prototype.forEach.call( elements, (el) => el.classList.remove('nojs'));

  require('../stylesheets/main.styl');
  //Add the stylesheets to overwrite inline styles defined in index.html

}
var App = React.createClass({

  //mixins: [PureRenderMixin],

  shouldComponentUpdateX: function(nextProps, nextState) {
    return false;
  },

  componentWillMount: function() {
    hideSplashScreen();
  },
  componentDidMount: function() {
    menu.start();
  },

  render: function() {
    log('Render the <App> container', this.props, this.state);
    const {children, allTags, lastUpdate, staticContent, textFilter, currentTagId } = this.props;
    return (
      <div id="layout">

        <Sidebar
          tags={ allTags}
          selectedTag={ currentTagId }
        />

        <main id="panel">

          <Header
            searchText={ textFilter }
          />

          { children }

          <Footer
            staticContent={ staticContent }
            lastUpdate={ lastUpdate }
          />

        </main>

      </div>
    );
  }

});

function mapStateToProps(state) {

  const {
    entities: { projects, tags },
    hotProjectIds,
    popularProjectIds,
    tagIds,
    lastUpdate,
    textFilter
  } = state.githubProjects;

  const allTags = tagIds.map( id => tags[id] );

  return {
    allTags,
    lastUpdate,
    currentTagId: getCurrentTagId(state),
    staticContent: state.staticContent
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

App.propTypes = {
  // Injected by React Router
  children: React.PropTypes.node
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
