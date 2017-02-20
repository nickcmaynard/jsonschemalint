var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var AsyncModulePlugin = require('async-module-loader/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  cache: true,
  entry: {
    app: "./src/app.js",
    vendor: "./src/vendor.js",
  },
  output: {
    path: "dist",
    publicPath: "",
    filename: "[name].[hash].js",
    chunkFilename: "[id].[hash].js"
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
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader' })},
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["app", "vendor"]
    }),
    new CopyWebpackPlugin([
      { from: 'www' }
    ]),
    new HtmlWebpackPlugin({
      template: 'html-loader!./www/index.html',
    }),
    new ExtractTextPlugin("[name].[hash].css"),
    new AsyncModulePlugin(),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise' // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
    }),
    new ngAnnotatePlugin({add: true})
  ],
  node: {
    fs: "empty"
  },
  profile: true
};