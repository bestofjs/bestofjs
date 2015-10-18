var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./layout/Sidebar');
var Header = require('./layout/Header');
var Footer = require('./layout/Footer');


var store = require('../scripts/store');
var actions = require('../scripts/actions');

require('./layout/footer.styl');

var App = React.createClass({

  mixins: [Reflux.ListenerMixin],

  componentWillMount: function() {
    //Listen to any change from the store (@trigger() in the store)
    this.listenTo(store, this.onChangeStore);

    actions.getProjects();

  },
  getInitialState: function() {
    return store.getInitialState();
  },
  onChangeStore: function(storeData) {
    //Store has changed => update the view.
    //console.log('onChangeStore, setState', storeData);
    this.setState(storeData);
  },
  render: function() {
    if (process.env.NODE_ENV === "development") {
      console.log('[DEV] Render the top level component.', this.state);
    }
    //Setup content about bestof.js.org so that it can be used in any page (homepage, about...)
    var staticContent = {
      projectName: 'bestof.js.org',
      repo: 'https://github.com/michaelrambeau/bestofjs-webui'
    };

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

          { this.props.children && React.cloneElement(this.props.children, {
            allProjects: this.state.allProjects,
            searchText: this.state.searchText,
            filteredProjects: this.state.filteredProjects,
            maxStars: this.state.maxStars,
            popularProjects: this.state.popularProjects,
            hotProjects: this.state.hotProjects,
            tags: this.state.tags,
            selectedTag: this.state.selectedTag,
            selectedSort: this.state.selectedSort,
            project: this.state.project,
            tag: this.state.tag,
            errorMessage: this.state.errorMessage,
            staticContent
          }) }
        </div>

        <Footer
          staticContent={ staticContent }
          lastUpdate={ this.state.lastUpdate }
        />

      </div>
    );
  },

});

module.exports = App;
