'use strict';

module.exports = function(grunt) {

  var lintFiles = [
    'src/*.js'
  ];

  var version = grunt.option('release');
  var fs = require('fs');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      crypto: {
        files: {
          'dist/crypto.js': [ './src/index.js' ]
        },
        options: {
          browserifyOptions: {
            standalone: 'crypto'
          },
          transform: [
            ["babelify", {
              ignore: ['*.min.js'],
              presets: ["es2015"]
            }]
          ]
        }
      },
      crypto_debug: {
        files: {
          'dist/crypto_debug.js': [ './src/index.js' ]
        },
        options: {
          browserifyOptions: {
            debug: true,
            standalone: 'crypto'
          },
          transform: [
            ["babelify", {
              ignore: ['*.min.js'],
              presets: ["es2015"]
            }]
          ]
        }
      },
      unittests: {
        files: {
          'test/lib/unittests-bundle.js': [ './test/unittests.js' ]
        },
        options: {
          external: [ 'crypto', '../../dist/crypto', '../../../dist/crypto' ]
        }
      }
    },
    replace: {
      crypto: {
        src: ['dist/crypto.js'],
        dest: ['dist/crypto.js'],
        replacements: [{
          from: /crypto.js VERSION/g,
          to: 'crypto.js v<%= pkg.version %>'
        }]
      },
      crypto_debug: {
        src: ['dist/crypto_debug.js'],
        dest: ['dist/crypto_debug.js'],
        replacements: [{
          from: /crypto.js VERSION/g,
          to: 'crypto.js v<%= pkg.version %>'
        }]
      }
    },
    uglify: {
      crypto: {
        files: {
          'dist/crypto.min.js' : [ 'dist/crypto.js' ]
        }
      },
      options: {
        banner: '/*! crypto.js v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>  */'
      }
    },
    jshint: {
      src: lintFiles,
      build: ['Gruntfile.js', '*.json'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsdoc: {
      dist: {
        src: ['README.md', 'src'],
        options: {
          destination: 'doc',
          recurse: true
        }
      }
    },
    mochaTest: {
      unittests: {
        options: {
          reporter: 'spec',
          timeout: 120000
        },
        src: [ 'test/unittests.js' ]
      }
    },
    copy: {
      browsertest: {
        expand: true,
        flatten: true,
        cwd: 'node_modules/',
        src: ['mocha/mocha.css', 'mocha/mocha.js'],
        dest: 'test/lib/'
      }
    },
    clean: ['dist/'],
    connect: {
      dev: {
        options: {
          port: 3001,
          base: '.',
          keepalive: true
        }
      },
      test: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['browserify:crypto']
      },
      test: {
        files: ['test/*.js', 'test/crypto/**/*.js', 'test/general/**/*.js'],
        tasks: ['browserify:unittests']
      }
    },
  });

  // Load the plugin(s)
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('set_version', function() {
    if (!version) {
      throw new Error('You must specify the version: "--release=1.0.0"');
    }

    patchFile({
      fileName: 'package.json',
      version: version
    });

    patchFile({
      fileName: 'bower.json',
      version: version
    });
  });

  function patchFile(options) {
    var path = './' + options.fileName,
      file = require(path);

    if (options.version) {
      file.version = options.version;
    }

    fs.writeFileSync(path, JSON.stringify(file, null, 2) + '\n');
  }

  // Build tasks
  grunt.registerTask('version', ['replace:crypto', 'replace:crypto_debug']);
  grunt.registerTask('default', ['clean', 'browserify', 'version', 'uglify']);
  grunt.registerTask('documentation', ['jsdoc']);

  // Test/Dev tasks
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};