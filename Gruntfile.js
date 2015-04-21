module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'is-my-json-valid': {
        files: {
          'draft4/js/is-my-json-valid/is-my-json-valid.js': ['node_modules/is-my-json-valid/index.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);

};
