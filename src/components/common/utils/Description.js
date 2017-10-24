import React from 'react'

// Component used to display repository `description`,
// removing emojis except if `showEmojis` option is set to true
// See node.js repository: `Node.js JavaScript runtime :sparkles::turtle::rocket::sparkles:`

const emoji = () => {
  const size = 20
  return `<img align="absmiddle" width="${size}" height=${size} src="https://assets-cdn.github.com/images/icons/emoji/$2.png">`
}

const Description = ({ text, showEmojis }) => {
  const replacedBy = showEmojis ? emoji() : ''
  const result = text.replace(/(:([a-z_\d]+):)/g, replacedBy).trim()
  if (showEmojis) return <HtmlDescription html={result} />
  return <span>{result}</span>
}

const HtmlDescription = ({ html }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
)

export default Description
