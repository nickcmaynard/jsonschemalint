var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var AsyncModulePlugin = require('async-module-loader/plugin');

module.exports = {
  entry: {
    bundle: "./src/app.js"
  },
  output: {
    path: "www/js/",
    publicPath: "js/",
    filename: "[name].min.js",
    sourceMapFilename: "[file].map"
  },
  stats: {
    // Configure the console output
    colors: true,
    modules: true,
    reasons: true
  },
  plugins: [
    new AsyncModulePlugin(),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
    }),
    new webpack.optimize.DedupePlugin(),
    new ngAnnotatePlugin({
      add: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ],
  node: {
    fs: "empty"
  }
};