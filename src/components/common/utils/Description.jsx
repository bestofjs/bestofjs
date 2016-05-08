import React from 'react';

// Component used to display repository `description`, removing emojis
// See node.js repository: Node.js JavaScript runtime :sparkles::turtle::rocket::sparkles:

const Description = (props) => {
  const { text } = props;
  const description = text.replace(/\:[a-z_\d]+\:/g, '').trim();
  return (
    <span>{ description }</span>
  );
};
module.exports = Description;
