const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const config = require('react-scripts/config/webpack.config.prod')

config.entry = './src/index.ssr.js'

const tempPath = path.resolve(process.cwd(), 'ssr-temp')

console.log(config.output)

config.output.path = tempPath
config.output.filename = 'static/ssr/[name].js'
config.output.libraryTarget = 'commonjs2'
delete config.output.chunkFilename

config.target = 'node'
config.externals = /^[a-z\-0-9]+$/
delete config.devtool

// const isHtmlWebpackPlugin = plugin => plugin.options && plugin.options.template

// config.plugins = config.plugins
//   .filter(
//     plugin =>
//       !(
//         plugin instanceof HtmlWebpackPlugin ||
//         plugin instanceof ManifestPlugin ||
//         plugin instanceof SWPrecacheWebpackPlugin
//       )
//   )
//   .filter(plugin => !isHtmlWebpackPlugin(plugin))

module.exports = config
