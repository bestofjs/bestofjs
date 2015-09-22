var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var Sidebar = require('./layout/Sidebar2');
var Header = require('./layout/Header');
var { RouteHandler } = Router;

var store = require('../scripts/store');
var actions = require('../scripts/actions');

var App = React.createClass({

  mixins: [Reflux.ListenerMixin],

  componentDidMount: function() {
    //Listen to any change from the store (@trigger() in the store)
    this.listenTo(store, this.onChangeStore);
    var data = this.props.data;
    actions.getProjects.completed(data);

    //Remove the splash screen by removing the .nojs class
    var elements = document.querySelectorAll('.nojs');
    Array.prototype.forEach.call( elements, (el) => el.classList.remove('nojs'));

    //Add the stylesheets to overwrite inline styles defined in index.html
    require('./layout/layout.styl');
    require('../stylesheets/base.styl');
    require('../stylesheets/table.styl');
  },
  getInitialState: function() {
    return store.getInitialState();
  },
  onChangeStore: function(storeData) {
    //Store has changed => update the view.
    console.log('onChangeStore, setState', storeData);
    this.setState(storeData);
  },
  render: function() {
    console.log('Render the top level component.', this.state);
    return (
      <div id="layout">

        <Sidebar
          tags={ this.state.tags}
          selectedTag={ this.state.selectedTag }
        />

        <div id="main">

          <Header
            searchText={this.state.searchText}
          />

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
            errorMessage={ this.state.errorMessage }
          />

        </div>

      </div>
    );
  },

});

module.exports = App;
