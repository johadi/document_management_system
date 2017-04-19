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

// import webpack from 'webpack';
// import path from 'path';
//
// export default {
//   devtool: 'inline-source-map',
//   entry: [
//     'eventsource-polyfill', // necessary for hot reloading with IE
//     'webpack-hot-middleware/client?reload=true', // note that it reloads
//     // the page if hot module reloading fails.
//     path.resolve(__dirname, 'client/src/index')
//   ],
//   output: {
//     filename: 'bundle.js',
//     publicPath: '/',
//     path: path.join(__dirname, 'client/src/')
//   },
//   devServer: {
//     contentBase: path.resolve(__dirname, 'client/src')
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoErrorsPlugin()
//   ],
//   module: {
//     loaders: [
//       {
//         test: /\.js$/,
//         include: path.join(__dirname, 'client'),
//         loaders: ['babel-loader'],
//         test: /\.js$/,
//         // exclude: ['node_modules', 'server', 'spec', 'dist'],
//         // loader: 'babel-loader',
//         // query: {
//         //   presets: ['react', 'es2015']
//         // }
//       }, {
//         test: /\.scss$/,
//         loaders: ['style-loader', 'css-loader', 'sass-loader']
//       }, {
//         test: /(\.css)$/,
//         loaders: ['style-loader', 'css-loader']
//       },
//
//       {
//         test: /\.(woff|woff2)$/,
//         loader: 'url?prefix=font/&limit=5000'
//       }, {
//         test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'url?limit=10000&mimetype=application/octet-stream'
//       }, {
//         test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'url?limit=10000&mimetype=image/svg+xml'
//       }, {
//         test: /\.(jpg|png|svg)$/,
//         loader: 'url-loader',
//         options: {
//           limit: 25000,
//         },
//       }
//     ]
//   }
// };

