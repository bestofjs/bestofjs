var React = require('react');
var MainContent = require('../common/MainContent');
var TagMenu = require ('../projects/TagMenu');
var mui = require('material-ui');
var { RaisedButton, FontIcon } = mui;

var About = React.createClass({

  render: function() {
    return (
      <MainContent>
        <h1>About</h1>
        <h2>Why bestof.js.org ?</h2>
        <p>1995 - 2015... JavaScript is 20 years old!</p>
        <p>
        What was a very limited scripting language in the browser became incredibly powerful...
        With node.js and io.js, it is used server-side to create fast applications or RESTful API.
        You can build mobile applications using one the hybrid frameworks.
        And the future is bright with ES6, JavaScript next version, already available with tools such as Babel.
        </p>
        <p>Lately, major companies have opened up their projects (like Facebook and React project for example)</p>
        <p>With so many interesting projects to follow,
          I felt that a tools was needed to help us follow what is happening in this everyday changing world.
          That is why bestof.js.org was born!
        </p>

          <a
            linkButton={true}
            href="https://github.com/michaelrambeau/bestofjs-webui"
            secondary={true}
            label=""
          >
            <i className="fa fa-github"></i>
            {' '}
            Star bestof.js.org on GitHub
          </a>

          <p>A project by Michael Rambeau</p>

        {    false && (
        <ul>
          <li>React</li>
          <li>Material-UI</li>
          <li>React-Router</li>
          <li>Webpack</li>
        </ul>)}

      </MainContent>
    );
  }

});

module.exports = About;
