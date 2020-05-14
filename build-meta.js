const fs = require('fs-extra')
const path = require('path')

const packageJSON = require('./package.json')

main()

function main() {
  const data = {
    date: new Date(),
    version: packageJSON.version
  }
  saveJSON(data, 'meta.json')
}

function saveJSON(json, fileName) {
  const filePath = path.join(process.cwd(), 'build', fileName)
  console.log('Saving', json, filePath)
  fs.outputJson(filePath, json)
  console.info('JSON file saved')
}
