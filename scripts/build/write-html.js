import fs from 'fs-extra'
import path from 'path'
import prettyBytes from 'pretty-bytes'

export default function writeHtmlFile(html, filename) {
  const filepath = path.join('www', filename)
  return fs
    .outputFile(filepath, html)
    .then(() => `${filename} file created (${prettyBytes(html.length)})`)
}
