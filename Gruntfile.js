/*jshint camelcase: false*/

module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  var shell = require('shelljs');

  // configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    dist_osx32: './dist/fuzzyclipboard/osx32/',
    dist_osx64: './dist/fuzzyclipboard/osx64/',
    dist_linux32: './dist/fuzzyclipboard/linux32/',
    dist_linux64: './dist/fuzzyclipboard/linux64/',
    dist_win32: './dist/fuzzyclipboard/win32/',
    dist_win64: './dist/fuzzyclipboard/win64/',
    tmp: 'buildTmp',
    resources: 'resources'
  };

  var getPlatformFullName = function(platform, architecture) {
    var fullName = '';

    if (platform === 'darwin') {
      fullName += 'osx';
    } else if (platform === 'linux') {
      fullName += 'linux';
    } else if (platform === 'win32') {
      fullName += 'win';
    }

    if (architecture === 'ia32') {
      fullName += '32';
    } else if (architecture === 'x64') {
      fullName += '64';
    }

    return fullName;
  }

  var getPlatformName = function() {
    return getPlatformFullName(process.platform, process.arch);
  }

  grunt.initConfig({
    config: config,

    nwjs: {
      options: {
        version: '0.12.0',
        platforms: [getPlatformFullName(process.platform, process.arch)],
        buildDir: './dist/', // Where the build version of my NW.js app is saved
      },
      src: [
        './app/**',
        './node_modules/shelljs/**'
      ]
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: '<%= config.app %>/js/*.js'
    },
  });

  grunt.registerTask('release', 'Prepare release package', function() {
    grunt.task.run('nwjs');
    grunt.task.run('copyIcons');
    grunt.task.run('zipReleased');
  });

  grunt.registerTask('copyIcons', 'Copy icons to released binary', function() {
    shell.exec('cp ./app/nw.icns ' + config['dist_' + getPlatformName()] + 'fuzzyclipboard.app/Contents/Resources/');
    shell.exec('cp ./app/Icon? ' + config['dist_' + getPlatformName()] + 'fuzzyclipboard.app/');
  })

  grunt.registerTask('zipReleased', 'Copy icons to released binary', function() {
    shell.exec('zip -r ' + config['dist_' + getPlatformName()] + 'fuzzyclipboard.zip ' + config['dist_' + getPlatformName()] + 'fuzzyclipboard.app ');
  });

  grunt.registerTask('setVersion', 'Set version to all needed files', function(version) {
    var config = grunt.config.get(['config']);
    var appPath = config.app;
    var resourcesPath = config.resources;
    var mainPackageJSON = grunt.file.readJSON('package.json');
    var appPackageJSON = grunt.file.readJSON(appPath + '/package.json');
    var infoPlistTmp = grunt.file.read(resourcesPath + '/mac/Info.plist.tmp', {
      encoding: 'UTF8'
    });
    var infoPlist = grunt.template.process(infoPlistTmp, {
      data: {
        version: version
      }
    });
    mainPackageJSON.version = version;
    appPackageJSON.version = version;
    grunt.file.write('package.json', JSON.stringify(mainPackageJSON, null, 2), {
      encoding: 'UTF8'
    });
    grunt.file.write(appPath + '/package.json', JSON.stringify(appPackageJSON, null, 2), {
      encoding: 'UTF8'
    });
    grunt.file.write(resourcesPath + '/mac/Info.plist', infoPlist, {
      encoding: 'UTF8'
    });
  });

  grunt.registerTask('createPlistFile', 'set node webkit and app relevant information to a new plist file', function() {
    var metadata = grunt.file.readJSON('.yo-rc.json');
    var resourcesPath = config.resources;
    var nwExecuteable = 'nwjs';
    if (metadata.nodeWebkitVersion.indexOf('v0.8.') === 0 || metadata.nodeWebkitVersion.indexOf('v0.9.') === 0 || metadata.nodeWebkitVersion.indexOf('v0.10.') === 0 || metadata.nodeWebkitVersion.indexOf('v0.11.') === 0) {
      nwExecuteable = 'node-webkit';
    }
    var infoPlistTmp = grunt.file.read(resourcesPath + '/mac/Info.plist.tmp', {
      encoding: 'UTF8'
    });
    var infoPlist = grunt.template.process(infoPlistTmp, {
      data: {
        nwExecutableName: nwExecuteable
      }
    });
    grunt.file.write(resourcesPath + '/mac/Info.plist', infoPlist, {
      encoding: 'UTF8'
    });
  })

  grunt.registerTask('check', [
    'jshint'
  ]);

  grunt.registerTask('dmg', 'Create dmg from previously created app folder in dist.', function() {
    var done = this.async();
    var createDmgCommand = 'resources/mac/package.sh "fuzzyclipboard"';
    require('child_process').exec(createDmgCommand, function(error, stdout, stderr) {
      var result = true;
      if (stdout) {
        grunt.log.write(stdout);
      }
      if (stderr) {
        grunt.log.write(stderr);
      }
      if (error !== null) {
        grunt.log.error(error);
        result = false;
      }
      done(result);
    });
  });

};
