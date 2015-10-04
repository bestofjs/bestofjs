var React = require('react');
var MainContent = require('../common/MainContent');
var StarMeButton = require('../common/StarMeButton');
var ProjectList = require('../projects/ProjectList');
var numeral = require('numeral');

var About = React.createClass({

  render: function() {
    var projects = this.props.popularProjects.slice(0, 1);
    var {repo, projectName} = this.props.staticContent;
    console.info(projects.length);
    return (
      <MainContent>
        <StarMeButton url={ repo } />
        <h1>About</h1>

        <h2>Why { projectName } ?</h2>
        <p>
          Javascript, HTML and CSS are advancing faster than ever, we are going fullspeed on innovation.<br/>
          Amazing open-source projects are released almost everyday.
          <ul>
            <li>How to stay up-to-date about the latest tendencies ?</li>
            <li>How to check quickly the projects that really matter, <i className="special">now</i> and not 6 months ago ?</li>
          </ul>
          I created { projectName } to address these questions.
        </p>

        <h2>Concept</h2>
        <p>Checking the number of stars on Github is a good way to check project popularity but it does not tell you when the stars have been added. </p>
        <p>{ projectName } takes "snapshot" of Github stars every day, for more than 300 projects, to detect the trends over the last weeks.</p>
        {projects.length > 0 && (
          <div>
            <h3>An example</h3>
            <p>
              Here is the most popular project of the application ({ projects[0].name }).
            </p>

            <ProjectList
              projects = { projects }
              maxStars = {this.props.maxStars}
              showStars = { true }
              showDelta = { false }
            />

          <p>
            At the top right corner, { numeral(projects[0].stars) } is the total number of stars on Github.
            <br/>
            The colored bar at the bottom shows the stars added on Github over the last days, day by day.
          </p>
          </div>
        )}

        <p>
        A project can have been popular a while ago, collecting a big number of stars...<br/>
          but a new contender may have made it obsolete since that time.
        </p>
        <p>
        Now with { projectName } you can see which projects are <i className="special">hot</i> in several categories (frameworks, React components, CSS tools...).
        </p>

        <h2>How it works</h2>
        <p>First, a list of projects related to the web platform (JavaScript of course but also HTML and CSS) is stored in a database.</p>
        <p>Everytime I find a new project, I add it to the database.</p>
        <p>Then everyday, an automatic task checks project data from Github, for every project stored and generates data consumed by the web application.</p>
        <p>The web application displays the total number of stars and their variation over the last days.</p>

        <h2>Do you want more projects ?</h2>
        <p>Rather than scanning all existing projects on Github,
        I decided to focus on a curated list of projets I find "interesting", based on my experience and on things I read on the internet.<br/>
        <p>As a result, some great projects must be missing!</p>
        <p>Do not hesitate to contact me (by creating an issue in the <a href={ repo }>Github repository</a>, for example) if you want to suggest projects to add.
        </p>
        </p>

        <h2>Show your support!</h2>
        <p>If you like the application, please star the project on <a href={ repo }>Github</a>...</p>
        <p>...we are all made of stars <img src="images/star.png" width="16" height="16" alt="star" /> !</p>
        <p>Thank you for your support!</p>

      </MainContent>
    );
  }

});

module.exports = About;
