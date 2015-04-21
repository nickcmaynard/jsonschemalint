module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'dist': {
        files: {
          'draft4/js/is-my-json-valid/is-my-json-valid.js': ['node_modules/is-my-json-valid/index.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'is-my-json-valid'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);

};
