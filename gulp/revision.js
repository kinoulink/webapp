'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    utils       = require('./utils'),
    $           = require('gulp-load-plugins')();

gulp.task("revision:assets", [], function()
{
    return gulp.src([
            path.join(conf.paths.build, 'js', '*.js'),
            path.join(conf.paths.build, 'css', '*.css')
        ], {base : conf.paths.build})
        .pipe($.rev())
        .pipe(gulp.dest(conf.paths.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(conf.paths.build))
});

if (conf.project.build.rev)
{
    gulp.task("revision", ["revision:assets"], function ()
    {
        return gulp.src(path.join(conf.paths.build, 'index.html'))
            .pipe($.revReplace({
                manifest: gulp.src(path.join(conf.paths.build, 'rev-manifest.json'))
            }))
            .pipe(gulp.dest(conf.paths.build));
    });
}
else
{
    gulp.task("revision");
}