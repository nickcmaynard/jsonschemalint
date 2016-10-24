module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'ajv': {
        files: {
          'www/js/ajv/ajv.js': ['node_modules/ajv/lib/ajv.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'ajv'
          }
        }
      },
      'jsv': {
        files: {
          'www/js/jsv/jsv.js': ['node_modules/JSV/lib/jsv.js', 'node_modules/JSV/lib/environments.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'jsv'
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
          'www/js/ajv/ajv.min.js': ['www/js/ajv/ajv.js'],
          'www/js/jsv/jsv.min.js': ['www/js/jsv/jsv.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

};