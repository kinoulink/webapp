'use strict';

module.exports = function (grunt)
{
  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var appConfig = {
    app: require('./bower.json').appPath || 'web',
    cordova: {
      plugins: './cordova/plugins'
    },
    dist: './dist/plain',
    dist_gzip: './dist/gzip',
	vendor: './bower_components',
	tmp: './.tmp',
    phonegap: './cordova/www',
    release: grunt.template.today('yyyymmdd_hhMMss')
  };

    var gruntConfig = {
        yeoman: appConfig,
        pkg: grunt.file.readJSON('package.json')
    };

    grunt.util._.extend(gruntConfig, loadConfig('./grunt/'));

    grunt.initConfig(gruntConfig);

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
        'generate:server',
      'concurrent:server',
	  'concat',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build:cordova', [
    'clean:dist',
      'generate:server',
    'compass:dist',
    'autoprefixer',
    'concat',
    'ngmin',
      'cssmin:phonegap',
    'copy:phonegap',
      'string-replace:phonegap'
  ]);

  grunt.registerTask('test:cordova', [
      'build:cordova',
      'exec:run_phonegap_android'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
      'generate:dist',
      'compass:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
      'concurrent:dist',
    'filerev',
    'usemin',
    'htmlmin'
  ]);
  
  grunt.registerTask('deploy', [
	  'build',
	  'compress'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);

    grunt.registerTask('generate', 'Generate Javascript configuration', function (target)
    {
        var buffer = {};

        if (target === 'dist')
        {
            buffer['release'] = appConfig.release;
        }

        grunt.file.write(appConfig.app + '/scripts/generate.js', 'var _bzConfig = ' + JSON.stringify(buffer) + ';' + "\n");
    });
};

function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: path}).forEach(function(option) {
        key = option.replace(/\.js$/,'');
        object[key] = require(path + option);
    });

    return object;
}
