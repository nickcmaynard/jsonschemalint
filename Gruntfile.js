module.exports = function (grunt) {

  grunt.initConfig({
    clean: {
      bundle: ['dist/']
    },
    webpack: {
      production: require('./webpack.prod.config.js'),
      dev: require('./webpack.dev.config.js'),
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['build:dev']);
  grunt.registerTask('build:dev', ['webpack:dev']);
  grunt.registerTask('build:production', ['webpack:production']);

};
