const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const HOST = '0.0.0.0'
const PORT = 9000
const BUILD_MODE = process.env.BUILD_MODE
const SRC_PATH = `${__dirname}/src`
const PBL_PATH = `${__dirname}/build/${BUILD_MODE === 'PROD' ? 'prod' : 'dev'}`
const NODE_MODULES_PATH = `${__dirname}/node_modules`

if (!BUILD_MODE) {
  throw 'BUILD_MODE environment var is not defined'
}

const webpackConfig = {
  entry: {
    app: SRC_PATH
  },
  output: {
    path: PBL_PATH,
    filename: '[name].js'
  },
  devtool: BUILD_MODE === 'DEV' ? 'source-map' : undefined,
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: BUILD_MODE === 'DEV'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: BUILD_MODE === 'DEV'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['url-loader?limit=10000', 'img-loader']
      }
    ]
  },
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx'],
    modules: [NODE_MODULES_PATH],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      services: path.resolve(__dirname, 'src/services')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: SRC_PATH + '/index.html'
    })
  ],
  target: 'web',
  node: {
    console: true,
    tls: 'empty',
    net: 'empty',
    fs: 'empty'
  }
}

if (BUILD_MODE === 'DEV') {
  webpackConfig.devtool = 'source-map'
  webpackConfig.devServer = {
    host: HOST,
    port: PORT,
    contentBase: PBL_PATH,
    historyApiFallback: true,
    disableHostCheck: true,
    compress: true,
    proxy: {
      '/rest': 'http://localhost:19090'
    }
  }
}

if (BUILD_MODE === 'PROD') {
  webpackConfig.plugins.push(new UglifyJSPlugin())
}

// Add environmental vars.
const envVars = ['API_URL']
const envObject = {}
envVars.map(key => {
  const value = process.env[key]
  envObject[`process.env.${key}`] = JSON.stringify(value || '')
})
console.log('ENV VARS', envObject)
const envPlugin = new webpack.DefinePlugin(envObject)
webpackConfig.plugins.push(envPlugin)

module.exports = webpackConfig
