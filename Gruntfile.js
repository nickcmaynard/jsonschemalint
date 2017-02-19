module.exports = function (grunt) {

  grunt.initConfig({
    clean: {
      bundle: ['dist/']
    },
    webpack: {
      all: require('./webpack.prod.config.js')
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['webpack']);

};
