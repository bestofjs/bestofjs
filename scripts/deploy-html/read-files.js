const pify = require('pify')
const readdir = require('recursive-readdir')
const path = require('path')

const getRelativePath = folder => fullFilepath => {
  const index = fullFilepath.indexOf(folder)
  return fullFilepath.slice(index + folder.length + 1)
}

function readHtmlFilenamesFromFolder (folder = 'www') {
  const filepath = path.join(process.cwd(), folder)
  const re = /.*index\.html$/
  const isHtmlPage = filename => re.test(filename)
  return pify(readdir)(filepath)
    .then(filenames => filenames.filter(isHtmlPage))
    .then(filenames => filenames.map(getRelativePath(folder)))
}

module.exports = readHtmlFilenamesFromFolder
// readHtmlFilenamesFromFolder()
