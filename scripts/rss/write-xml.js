import fs from 'fs-extra'
import path from 'path'

export default function writeHtmlFile (xml, filename) {
  const filepath = path.join(process.cwd(), 'www', 'rss', filename)
  return fs.outputFile(filepath, xml)
    .then(() => `${filename} file created (${(xml.length / 1024).toFixed()} KB)`)
}
