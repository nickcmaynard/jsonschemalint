module.exports = function (grunt) {

  grunt.initConfig({
    clean: {
      bundle: ['www/js/']
    },
    webpack: {
      all: require('./webpack.config.js')
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['webpack']);

};
