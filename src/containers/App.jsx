import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as authActionCreators from '../actions/authActions';

import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import getStaticContent from '../staticContent';
import menu from '../helpers/menu';
import log from '../helpers/log';

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
  Array.prototype.forEach.call(elements, (el) => el.classList.remove('nojs'));

  // Add the stylesheets to overwrite inline styles defined in index.html
  require('../stylesheets/main.styl');
}
var App = React.createClass({

  componentWillMount() {
    hideSplashScreen();
  },
  componentDidMount() {
    menu.start();
  },

  render() {
    log('Render the <App> container', this.props, this.state);
    const { children, allTags, popularTags, lastUpdate, staticContent, textFilter, currentTagId, auth, authActions } = this.props;
    return (
      <div id="layout">

        <Sidebar
          allTags={ allTags}
          popularTags={ popularTags}
          selectedTag={ currentTagId }
          auth={ auth }
          authActions={ authActions }
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
    entities: { tags },
    githubProjects: {
      tagIds,
      lastUpdate
    },
    auth
  } = state;

  const allTags = tagIds.map(id => tags[id]);
  const popularTags = allTags
    .slice()
    .sort((a, b) => b.counter > a.counter ? 1 : -1)
    .slice(0, 10);

  return {
    allTags,
    popularTags,
    lastUpdate,
    currentTagId: getCurrentTagId(state),
    staticContent: getStaticContent(),
    auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch)
  };
}

App.propTypes = {
  // Injected by React Router
  children: React.PropTypes.node
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
