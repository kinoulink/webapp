'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    utils       = require('./utils'),
    $           = require('gulp-load-plugins')();


/**
 * Concat all angular directives view.
 */
gulp.task('view:partials', function()
{
    return processPartials();
});

gulp.task('view:index', function()
{
    return  processHTML(gulp.src(
                path.join(conf.paths.src, '*.html')
            ))
            .pipe(gulp.dest(conf.paths.dist))
});

function processHTML(stream)
{
    stream = utils.bindConfiguration(stream);

    return stream
            .pipe($.if(conf.project.build.minify, $.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            })));
}

function processPartials()
{
    return processHTML(gulp.src([
        path.join(conf.paths.src, 'views/**/*.html')
    ]))
        .pipe($.angularTemplatecache('views.js', {
            module: conf.project.name
        }))
        .pipe(gulp.dest(conf.paths.dist + '/js/'));
}

exports.processPartials = processPartials;

gulp.task('views', ['view:index', 'view:partials']);