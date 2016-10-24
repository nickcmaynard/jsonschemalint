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
      },
      'jsv': {
        files: {
          'draft5/js/jsv/jsv.js': ['node_modules/JSV/lib/jsv.js', 'node_modules/JSV/lib/environments.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'jsv'
          }
        }
      }
    },
    clean: {
      temp: ['.tmp/']
    },
    mkdir: {
      temp: {
        options: {
          create: ['.tmp/']
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
          'draft5/js/ajv/ajv.min.js': ['draft5/js/ajv/ajv.js'],
          'draft5/js/jsv/jsv.min.js': ['draft5/js/jsv/jsv.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mkdir');

  grunt.registerTask('default', ['clean', 'mkdir', 'browserify', 'uglify']);

};