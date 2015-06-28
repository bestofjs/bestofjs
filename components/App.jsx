var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var AppLeftNav = require('./common/AppLeftNav');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var mui = require('material-ui');
var { AppBar, AppCanvas, Menu, IconButton } = mui;
var ThemeManager = new mui.Styles.ThemeManager();

console.log('palette', ThemeManager.palette);
//console.log('AppBar', AppBar.getStyle());
var customTheme = require('../stylesheets/theme');

var flux = require('../scripts/app');

ThemeManager.setTheme(customTheme);

var App = React.createClass({

  mixins: [Reflux.ListenerMixin],

  // material-ui
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentDidMount: function() {
    //Listen to any change from the store (@trigger() in the store)
    this.listenTo(flux.store, this.onChangeStore);
  },
  getInitialState: function() {
    console.log(flux.store.getInitialState());
    return flux.store.getInitialState();
  },
  onChangeStore: function(storeData) {
    //Store has changed => update the view.
    console.log('onChangeStore, setState', storeData);
    this.setState(storeData);
  },
  render: function() {
    console.log('Render the top level component.');
    return (
      <AppCanvas predefinedLayout={1} style={{backgroundColor: '#ECECEC'}}>
        <AppBar
           title={ 'bestof.js.org' }
           className="mui-dark-theme"
           onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
           onMenuIconButtonTouchTap={this._onLeftIconButtonTouchTap}
           zDepth={0}
        >
        </AppBar>

        <AppLeftNav ref="leftNav" />

        <div className="container">
          <RouteHandler
            allProjects={ this.state.allProjects }
            searchText={this.state.searchText}
            filteredProjects={ this.state.filteredProjects }
            maxStars={ this.state.maxStars }
            popularProjects={ this.state.popularProjects }
            hotProjects={ this.state.hotProjects }
            tags={ this.state.tags }
            selectedTag={ this.state.selectedTag }
            selectedSort={ this.state.selectedSort }
            project={ this.state.project }
            tag={ this.state.tag }
          />
        </div>

      </AppCanvas>
    );
  },

  _onLeftIconButtonTouchTap: function() {
    console.log('tap!');
    this.refs.leftNav.toggle();
  },


});

App.contextTypes = {
  router: React.PropTypes.func
};

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = App;
