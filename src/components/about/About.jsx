var React = require('react');
var MainContent = require('../common/MainContent');
var StarMeButton = require('../common/StarMeButton');
var ProjectCard = require('../projects/ProjectCard');
var Delta = require('../common/utils/Delta');
var Stars = require('../common/utils/Stars');
var About = React.createClass({

  render: function() {
    const data = this.props.githubProjects;
    var projects = data.popularProjects.slice(0, 1);
    var {repo, projectName} = this.props.staticContent;
    return (
      <MainContent>
        <StarMeButton url={ repo } />
        <h1>About</h1>

        <h2>Why { projectName } ?</h2>
        <p>
          Javascript, HTML and CSS are advancing faster than ever, we are going fullspeed on innovation.<br/>
          Amazing open-source projects are released almost everyday.
        </p>
        <ul>
          <li>How to stay up-to-date about the latest tendencies ?</li>
          <li>How to check quickly the projects that really matter, <i className="special">now</i> and not 6 months ago ?</li>
        </ul>
        <p>{ projectName } was creaded to address these questions.</p>


        <h2>Concept</h2>
        <p>Checking the number of stars on Github is a good way to check project popularity but it does not tell you when the stars have been added. </p>
        <p>{ projectName } takes "snapshot" of Github stars every day, for more than 300 projects, to detect the trends over the last weeks.</p>

        {projects.length > 0 && (
          <Example project={ projects[0] } />
        )}

        <h2>How it works</h2>
        <p>First, a list of projects related to the web platform (JavaScript of course but also HTML and CSS) is stored in a database.</p>
        <p>Everytime we find a new project, we add it to the database.</p>
        <p>Then everyday, an automatic task checks project data from Github, for every project stored and generates data consumed by the web application.</p>
        <p>The web application displays the total number of stars and their variation over the last days.</p>

        <h2>Do you want more projects ?</h2>
        <p>Rather than scanning all existing projects on Github,
        We decided to focus on a curated list of projets we find "interesting", based on our experience and on things we read on the internet.
        </p>
        <p>As a result, some great projects must be missing!</p>
        <p>Do not hesitate to contact us (by creating an issue in the <a href={ repo }>Github repository</a>, for example) if you want to suggest projects to add.
        </p>


        <h2>Show your support!</h2>
        <p>If you like the application, please star the project on <a href={ repo }>Github</a>...</p>
        <p>...we are all made of stars <img src="images/star.png" width="16" height="16" alt="star" /> !</p>
        <p>Thank you for your support!</p>

      </MainContent>
    );
  }

});

var Example = React.createClass({

  render: function() {
    var { project, maxStars } = this.props;
    return (
      <div>
        <h2>An example</h2>
        <p>
          Here is the most popular project of the application ({ project.name }).
        </p>

        <ProjectCard
          project = { project }
          index = { 0 }
          showDescription = { true }
          maxStars = { maxStars }
          showStars = { true }
          showDelta = { true }
        />

        <p>
          At the top right corner:
        </p>
        <ul>
         <li>
           <Stars value={ project.stars } icon={ true }/>
           {' '}
            is the total number of stars on Github.
         </li>
         <li>
           <div style={{ width: 80, display: 'inline-block'}}>
             <Delta value={ project.deltas[0] } icon={ true } />
           </div>
           {' '}
          is the number of stars added yesterday.</li>
        </ul>
        <p>At the bottom:</p>
        <p>
          The colored bar shows the stars added on Github over the last days, day by day.
        </p>
      </div>
    );
  }

});

module.exports = About;
