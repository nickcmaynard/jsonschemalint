var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

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