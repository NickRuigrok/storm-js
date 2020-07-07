const webpack = require('webpack');

module.exports = {
  entry: ['./index.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'storm.js'
  },
};
