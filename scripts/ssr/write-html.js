const fs = require('fs-extra')
const path = require('path')
const prettyBytes = require('pretty-bytes')

function writeHtmlFile(html, filename) {
  const filepath = path.join('www', filename)
  return fs
    .outputFile(filepath, html)
    .then(() => `${filename} file created (${prettyBytes(html.length)})`)
}

module.exports = writeHtmlFile
