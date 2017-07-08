// Generate Webpack config, dependending on the environment (development or production)
// The exported function is used by `webpack.*.config.js` files.

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getFullPage = require('../scripts/build/getFullPage')
const constants = require('./constants')

const USE_PREACT = false

function getPlugins (env) {
  const envPlugin = new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(env)
    }
  })

  const plugins = [envPlugin]
  if (env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin())
    plugins.push(new webpack.NamedModulesPlugin())
    // Get the html template
    const html = getFullPage({ isDev: true })
    plugins.push(new HtmlWebpackPlugin({
      inject: false,
      templateContent: html
    }))
  } else {
    // ExtractTextPlugin used to generate a separate CSS file, in production only.
    // documentation: http://webpack.github.io/docs/stylesheets.html
    plugins.push(
      new ExtractTextPlugin(`./${constants.staticFolder}/build/[name].css`)
    )

    // Do not display warning messages from Uglify
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    )
  }

  return plugins
}

function getRules (env) {
  const jsRule = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false, // required otherwise src/.babelrc settings will be used
          presets: [
            ['es2015', { 'modules': false }],
            'stage-1',
            'react'
          ],
          plugins: [
            'react-hot-loader/babel'
          ]
        }
      }
    ]
  }
  const cssRule = {
    test: /\.css$/
  }
  const stylusRule = {
    test: /\.styl$/
  }

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: function () {
        return [autoprefixer]
      }
    }
  }

  const urlRule = {
    test: /\.svg$/,
    use: { loader: 'url-loader', options: { limit: 5000 } }
  }

  if (env === 'development') {
    cssRule.use = [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      postCssLoader
    ]
    stylusRule.use = [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'stylus-loader' }
    ]
  } else {
    cssRule.use = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', postCssLoader]
    })
    stylusRule.use = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', postCssLoader, 'stylus-loader']
    })
  }
  const rules = [jsRule, stylusRule, cssRule, urlRule]
  return rules
}

function getEntry (env) {
  const devPipeline = [
    `webpack-dev-server/client?http://localhost:${constants.port}`,
    'webpack/hot/only-dev-server',
    './src/entry.js'
  ]
  return {
    app: env === 'development' ? (
      (!USE_PREACT ? ['react-hot-loader/patch'] : []).concat(devPipeline)
    ) : (
      './src/entry.js'
    )
  }
}

function getOutput (env) {
  const rootPath = path.resolve(__dirname, '..', constants.staticFolder)
  const filename = 'build/bundle-[name].js'
  return env === 'development' ? (
    {
      path: rootPath,
      filename,
      publicPath: '/' // required when using browserHistory, to make nested URLs work
    }
  ) : (
    {
      filename: `${constants.staticFolder}/${filename}`
    }
  )
}

const defaultResolveOptions = {
  extensions: ['.js', '.jsx']
}
const preactAlias = {
  'react': 'preact-compat',
  'react-dom': 'preact-compat'
}
const resolve = Object.assign(
  {},
  defaultResolveOptions,
  USE_PREACT ? { alias: preactAlias } : {}
)

module.exports = function (env) {
  process.traceDeprecation = true
  const config = {
    entry: getEntry(env),
    target: env === 'test' ? 'node' : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: getOutput(env),
    plugins: getPlugins(env),
    module: {
      rules: getRules(env)
    },
    resolve
  }
  if (env === 'development') {
    config.devtool = 'eval'
  }
  return config
}
