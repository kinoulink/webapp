'use strict';

var path = require('path'),
    fs = require('fs'),
    gulp = require('gulp'),
    conf = require('./conf'),
    bulkSass = require('gulp-sass-bulk-import'),
    $ = require('gulp-load-plugins')(),
    sassOptions = {
        style: 'expanded',
        compass: true,
        loadPath: [
            path.join(conf.paths.src, 'styles'),
            "./bower_components"
        ]
    };

getStyles().forEach(function(style)
{
    gulp.task('style:' + style, function()
    {
        return processStyle(style);
    });
});

/**
 * Get styles (styles/*.scss)
 *
 * @returns {*}
 */
function getStyles()
{
    return  fs
                .readdirSync(path.join(conf.paths.src, 'styles'))
                .filter(function (file)
                {
                    return file.indexOf('_') !== 0 && file.indexOf('.scss') > 0;
                })
                .map(function (file)
                {
                    return file.replace('.scss', '');
                });
}

/**
 *
 *
 * @param task
 * @returns {*}
 */
function processStyle(task)
{
    var cssFilters = $.filter('*.css', { restore : true});

    return gulp
            .src(path.join(conf.paths.src, 'styles', task + '.scss'))
            .pipe(bulkSass())
            .pipe($.rubySass(sassOptions)).on('error', conf.errorHandler('RubySass'))
            .pipe(cssFilters)
                .pipe($.if(conf.project.build.minify, $.cssnano()))
            .pipe(cssFilters.restore)
            .pipe(gulp.dest(path.join(conf.paths.dist, 'css')));
}

gulp.task('styles', ['style:app', 'style:vendor']);

exports.processStyle    = processStyle;
exports.getStyles       = getStyles;