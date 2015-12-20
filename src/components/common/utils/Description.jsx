var React = require('react');
var PropTypes = React.PropTypes;

// Component used to display repository `description`, removing emojis
// See node.js repository: Node.js JavaScript runtime :sparkles::turtle::rocket::sparkles:

var Description = React.createClass({

  propTypes: {
    text: PropTypes.string.isRequired
  },

  render() {
    const { text } = this.props;
    const description = text.replace(/\:[a-z_\d]+\:/g, '').trim();
    return (
      <span>&ldquo;{' '}{ description }{' '}&rdquo;</span>
    );
  }
});

module.exports = Description;
