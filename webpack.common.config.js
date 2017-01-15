var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var AsyncModulePlugin = require('async-module-loader/plugin');

module.exports = {
  cache: true,
  entry: {
    app: "./src/app.js",
    vendor: "./src/vendor.js"
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
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["app", "vendor"]
    }),
    new AsyncModulePlugin(),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise' // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
    }),
    new webpack.optimize.DedupePlugin(),
    new ngAnnotatePlugin({add: true})
  ],
  node: {
    fs: "empty"
  },
  profile: true
};