/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp        = require('gulp'),
    conf        = require('./gulp/conf'),
    wrench      = require('wrench'),
    path        = require('path'),
    runSequence = require('run-sequence'),
    $           = require('gulp-load-plugins')();

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
    require('./gulp/' + file);
});

gulp.task('build', function(cb)
{
    runSequence(
        'clean',
        ['scripts', 'styles', 'assets'],
        'views',
        'revision',
        cb
    );
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean', 'build']);

gulp.task('clean', function ()
{
    return gulp
        .src(conf.paths.dist, {read : false})
        .pipe($.clean())
});


