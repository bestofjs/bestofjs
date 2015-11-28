import React from 'react';

import Sidebar  from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import menu from '../menu';


import { connect } from 'react-redux';
//import { pushState } from 'redux-router';

import * as actions from '../actions';

import { bindActionCreators } from 'redux';

// require *.styl intructions have been moved from components to the App.jsx container
// to be able to run tests with node.js

function hideSplashScreen() {
  var elements = document.querySelectorAll('.nojs');
  Array.prototype.forEach.call( elements, (el) => el.classList.remove('nojs'));

  require('../stylesheets/main.styl');
  //Add the stylesheets to overwrite inline styles defined in index.html

}
var App = React.createClass({

  componentWillMount: function() {
    hideSplashScreen();
  },
  componentDidMount: function() {
    menu.start();
  },

  render: function() {
    if (process.env.NODE_ENV === 'development') console.log('Rendering the App container', this.props);
    const {githubProjects, staticContent, actions} = this.props;
    return (
      <div id="layout">

        <Sidebar
          tags={ githubProjects.allTags}
          selectedTag={ githubProjects.tagFilter }
        />

        <main id="panel">

          <Header
            searchText={ githubProjects.textFilter}
            actions= { this.props.actions }
          />

          { this.props.children && React.cloneElement(this.props.children, {
            githubProjects,
            staticContent,
            actions
          }) }

          <Footer
            staticContent={ this.props.staticContent }
            lastUpdate={ this.props.githubProjects.lastUpdate }
          />

        </main>

      </div>
    );
  }

});

function mapStateToProps(state) {
  return {
    githubProjects: state.githubProjects,
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
