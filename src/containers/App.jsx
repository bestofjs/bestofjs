var React = require('react');
var PropTypes = React.PropTypes;

var Sidebar = require('../components/layout/Sidebar');
var Header = require('../components/layout/Header');
var Footer = require('../components/layout/Footer');

import { connect } from 'react-redux';
//import { pushState } from 'redux-router';

import * as actions from '../actions';

import { bindActionCreators } from 'redux';

function loadData(props) {
  props.actions.fetchProjects()
    .then( () => hideSplashScreen() );
}

function hideSplashScreen() {
  var elements = document.querySelectorAll('.nojs');
  Array.prototype.forEach.call( elements, (el) => el.classList.remove('nojs'));

  //Add the stylesheets to overwrite inline styles defined in index.html
  require('../components/layout/layout.styl');
  require('../stylesheets/base.styl');
  require('../stylesheets/table.styl');
}



var App = React.createClass({

  componentWillMount: function() {
    loadData(this.props);
  },

  render: function() {
    console.log('Rendering the App container', this.props);
    const {githubProjects, staticContent} = this.props;
    return (
      <div id="layout">

        <Sidebar
          tags={ githubProjects.allTags}
          selectedTag={ githubProjects.tagFilter }
        />

        <div id="main">

          <Header
            searchText={ githubProjects.textFilter}
          />

          { this.props.children && React.cloneElement(this.props.children, {
            githubProjects,
            staticContent
          }) }
        </div>

        <Footer
          staticContent={ this.props.staticContent }
          lastUpdate={ this.props.githubProjects.lastUpdate }
        />

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
  children: PropTypes.node
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
