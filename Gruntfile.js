module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'is-my-json-valid': {
        files: {
          '.tmp/js/is-my-json-valid.js': ['node_modules/is-my-json-valid/index.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'is-my-json-valid'
          }
        }
      },
      'ajv': {
        files: {
          '.tmp/js/ajv.js': ['node_modules/ajv/lib/ajv.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'ajv'
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
          'draft4/js/is-my-json-valid/is-my-json-valid.min.js': ['.tmp/js/is-my-json-valid.js'],
          'draft5/js/ajv/ajv.min.js': ['.tmp/js/ajv.js']
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
