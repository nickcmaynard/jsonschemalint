module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'bundle': {
        files: {
          '.tmp/bundle.js': ['src/app.js']
        }
      }
    },
    clean: {
      tmp: ['.tmp']
    },
    mkdir: {
      tmp: {
        options: {
          create: ['.tmp/']
        }
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      bundle: {
        files: {
          'www/js/bundle.js': ['.tmp/bundle.js']
        }
      }
    },
    uglify: {
      'dist': {
        options: {
          sourceMap: true
        },
        files: {
          'www/js/bundle.min.js': ['www/js/bundle.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', ['clean', 'mkdir', 'browserify', 'ngAnnotate', 'uglify']);

};