var React = require('react');
var MainContent = require('../common/MainContent');
var TagMenu = require ('../projects/TagMenu')

var About = React.createClass({

  render: function() {
    return (
      <MainContent>
        <h1>About</h1>
        <p>A project by Michael Rambeau</p>
        <p>Technologies:</p>
        <ul>
          <li>React</li>
          <li>Material-UI</li>
          <li>React-Router</li>
        </ul>
        <TagMenu tags={ this.props.tags } selectedTag={ this.props.selectedTag }/>
      </MainContent>
    );
  }

});

module.exports = About;
