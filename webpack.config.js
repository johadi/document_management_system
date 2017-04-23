import webpack from 'webpack';
const path = require('path');
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
    path: path.resolve('client/public')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS)
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
