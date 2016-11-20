var webpack = require("webpack");
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.config.js');

module.exports = webpackMerge(commonConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
});