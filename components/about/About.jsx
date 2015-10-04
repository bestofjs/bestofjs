var React = require('react');
var MainContent = require('../common/MainContent');
var StarMeButton = require('../common/StarMeButton');
var ProjectList = require('../projects/ProjectList');

var About = React.createClass({

  render: function() {
    var projects = this.props.popularProjects.slice(0, 1);
    var {repo, projectName} = this.props.staticContent;
    return (
      <MainContent>
        <StarMeButton url={ repo } />
        <h1>About</h1>
        <h2>Why { projectName } ?</h2>

        <p>In the JavaScript world, we are going fullspeed on innovation, an interesting project is released almost everyday.
          <ul>
            <li>How to stay up-to-date about the latest tendencies ?</li>
            <li>How to check quickly the projects that really matter, <i>now</i> and not 6 months ago ?</li>
          </ul>
        I created { projectName } to address these questions.
        </p>

        <h2>How it works</h2>
        <p>A list of projects, related to the web platform (JavaScript of course but also HTML and CSS) is stored in the application.</p>
        <p>Everyday, an automatic process checks stars added on Github for every project stored in the application.</p>
        <p>You can check the total number of stars and the number of stars over the last days.</p>

        <p>For example, here is the most popular project ({ projects[0].name }).
          <br/>The colored bar the bottom shows the stars added on Github over the last days, day by day.
        </p>

        <ProjectList
          projects = { projects }
          maxStars = {this.props.maxStars}
          showStars = { true }
          showDelta = { false }
        />

        <p>
        A project can have been popular a while ago, collecting a big number of stars...<br/>
      but a new contender may have made it obsolete since that time.
        </p>
        <p>
        Now with { projectName } you can see which projects are "hot" in several categories (frameworks, React components, CSS tools...)
        </p>

        <h2>I cannot find my project!</h2>
        <p>Rather than scanning all existing projects on Github,
        I decided to focus on a curated list of projets I find "interesting", based on my experience and on things I read on the internet.<br/>
        <p>As a result, some great projects must be missing!</p>
        <p>Do not hesitate to contact me (by creating an issue in the <a href={ repo }>Github repository</a>, for example) if you want to suggest projects to add.
        </p>
        </p>

        <h2>Show your support!</h2>
        <p>If you like the application, please star the project on <a href={ repo }>Github</a>.</p>
        <p>Any feedback is welcome.Thank you for your support!</p>

      </MainContent>
    );
  }

});

module.exports = About;
