'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    utils       = require('./utils'),
    $           = require('gulp-load-plugins')();

gulp.task("revision:assets", [], function()
{
    return gulp.src([
            path.join(conf.paths.dist, 'js', '*.js'),
            path.join(conf.paths.dist, 'css', '*.css')
        ], {base : conf.paths.dist})
        .pipe($.rev())
        .pipe(gulp.dest(conf.paths.dist))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(conf.paths.dist))
});

if (conf.project.build.rev)
{
    gulp.task("revision", ["revision:assets"], function ()
    {
        return gulp.src(path.join(conf.paths.dist, 'index.html'))
            .pipe($.revReplace({
                manifest: gulp.src(path.join(conf.paths.dist, 'rev-manifest.json'))
            }))
            .pipe(gulp.dest(conf.paths.dist));
    });
}
else
{
    gulp.task("revision");
}