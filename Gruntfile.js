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
    },
    uglify: {
      'dist': {
        options: {
          sourceMap: true
        },
        files: {
          'draft4/js/is-my-json-valid/is-my-json-valid.min.js': ['draft4/js/is-my-json-valid/is-my-json-valid.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

};
