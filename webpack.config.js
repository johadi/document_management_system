import webpack from 'webpack';

const path = require('path');

const config = {
  context: path.join(__dirname, 'client/src'),
  devtool: 'inline-source-map',
  entry: './index.jsx',

  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve('client/public')
  },
  resolve: {
    alias: {
      jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Hammer: 'hammerjs/hammer'
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
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    },
    {
      test: /\.(woff|png|jpg|gif)$/,
      loader: 'url-loader?limit=250000'
    }]
  },
  devServer: {
    contentBase: 'client/src',
    historyApiFallback: true
  }
};
module.exports = config;


