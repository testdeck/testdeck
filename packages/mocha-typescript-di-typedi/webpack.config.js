var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var distPath = path.resolve(__dirname, 'dist');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: 'index.ts',
  output: {
    path: distPath,
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  externals: [
    'reflect-metadata',
    'typedi'
  ],
  resolve: {
    modules: [
      __dirname,
      'node_modules'
    ],
    extensions: [
      '.ts'
    ]
  }
};
