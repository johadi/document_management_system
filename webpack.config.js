const webpack = require('webpack');
const path = require('path');

require('dotenv').config();

const GLOBALS = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
};

const config = {
  context: path.join(__dirname, 'client/src'),
  devtool: 'inline-source-map',
  entry: './index.jsx',

  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve('client/public/dist')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: ['node_modules', 'server', 'spec', 'dist'],
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.jsx$/,
      exclude: ['node_modules', 'server', 'spec', 'dist'],
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /(\.css)$/,
      loaders: ['style-loader', 'css-loader']
    },
    {
      test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=250000'
    }]
  },
  devServer: {
    contentBase: 'client/src',
    historyApiFallback: true
  },
  externals: {
    jquery: 'jQuery'
  }
};

module.exports = config;
