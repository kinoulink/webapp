'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

function browserSyncInit(baseDir, browser)
{
  browser = browser === undefined ? 'default' : browser;

  var server = {
    baseDir: baseDir,
    routes: {
        '/bower_components': 'bower_components',
        '/images' : path.join(conf.paths.src, 'images'),
        '/fonts' : path.join(conf.paths.src, 'fonts'),
        '/api' : path.join(conf.paths.src, 'api'),
        '/sounds' : path.join(conf.paths.src, 'sounds')
    }
  };

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['build', 'watch'], function ()
{
  browserSyncInit(conf.paths.build);
});

gulp.task('serve:dist', function ()
{
    browserSyncInit(conf.paths.build);
});
