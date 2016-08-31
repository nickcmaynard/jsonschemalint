module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'is-my-json-valid': {
        files: {
          'draft4/js/is-my-json-valid/is-my-json-valid.js': ['node_modules/is-my-json-valid/index.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'is-my-json-valid'
          }
        }
      },
      'ajv': {
        files: {
          'draft5/js/ajv/ajv.js': ['node_modules/ajv/lib/ajv.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'ajv'
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
          'draft4/js/is-my-json-valid/is-my-json-valid.min.js': ['draft4/js/is-my-json-valid/is-my-json-valid.js'],
          'draft5/js/ajv/ajv.min.js': ['draft5/js/ajv/ajv.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

};
