module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      'dist': {
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
          'draft5/js/ajv/ajv.min.js': ['draft5/js/ajv/ajv.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

};
