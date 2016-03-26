'use strict';

var path        = require('path'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    taskStyles  = require('./styles.js'),
    taskScripts = require('./scripts.js'),
    taskViews   = require('./views.js');


/**
 * Watch all HTML files.
 */
gulp.task('watch:views', function()
{
    gulp.watch(path.join(conf.paths.src, '*.html'), function (event)
    {
        runSequence('view:index', function ()
        {
            browserSync.reload(event.path)
        });
    });

    gulp.watch(path.join(conf.paths.src, 'views/**/*.html'), function ()
    {
        taskViews
            .processPartials()
            .pipe(browserSync.stream());
    });
});

/**
 * Watch all JS files.
 */
gulp.task('watch:scripts', function()
{
    gulp.watch([
        path.join(conf.paths.src, 'scripts/**/*.js')
    ], function ()
    {
        taskScripts
            .processScript('app')
            .pipe(browserSync.stream());
    });
});

/**
 * Watch all SCSS files.
 */
gulp.task('watch:styles', function()
{
    var styles = taskStyles.getStyles();

    gulp.watch([
        path.join(conf.paths.src, 'styles/**/*')
    ], function ()
    {
        styles.forEach(function(task)
        {
            taskStyles
                .processStyle(task)
                .pipe(browserSync.stream());
        });
    });
});

gulp.task('watch', ['watch:styles', 'watch:scripts', 'watch:views']);
