'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    pngquant    = require('imagemin-pngquant'),
    jpegtran    = require('imagemin-jpegtran'),
    $           = require('gulp-load-plugins')();


gulp.task('asset:images', function ()
{
    var pngFilter   = $.filter('**/*.png', { restore: true }),
        jpegFilter  = $.filter('**/*.{jpg,jpeg}', { restore: true });

    return gulp
        .src([
            path.join(conf.paths.src, 'images', '**/*')
        ])
            .pipe($.imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant(), jpegtran()]
            }))
        .pipe(gulp.dest(path.join(conf.paths.build, '/images/')))
        .pipe($.size({ title: path.join(conf.paths.build, '/'), showFiles: false }));
});

gulp.task('asset:fonts', function ()
{
    return gulp
            .src([
                path.join(conf.paths.src, 'fonts', '**/*.{eot,svg,ttf,woff,woff2}')
            ])
            .pipe(gulp.dest(path.join(conf.paths.build, '/fonts/')))
            .pipe($.size({ title: path.join(conf.paths.build, '/'), showFiles: true }));
});

gulp.task('asset:others', function()
{
    return gulp
        .src([
            path.join(conf.paths.src, './api/**/*'),
            path.join(conf.paths.src, './sounds/**/*'),
            path.join(conf.paths.src, './*.{txt,ico,config,xml,png,jpg,jpeg}')
        ], {base : conf.paths.src})
        .pipe(gulp.dest(path.join(conf.paths.build)))
});

if (conf.project.build.assets)
{
    gulp.task('assets', ["asset:fonts", "asset:images", "asset:others"]);
}
else
{
    gulp.task('assets');
}