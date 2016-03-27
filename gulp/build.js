'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    utils       = require('./utils'),
    runSequence = require('run-sequence'),
    tag_version = require('gulp-tag-version'),
    $           = require('gulp-load-plugins')();

gulp.task('build', function(cb)
{
    return runSequence(
        'clean',
        ['scripts', 'styles', 'assets'],
        'views',
        'revision',
        'build:archive',
        cb
    );
});

gulp.task('build:archive', function(cb)
{
    return gulp.src(conf.paths.build + '/**')
            .pipe($.tar(conf.paths.builds + '/' + conf.env + '-' + conf.package.version + '.tar'))
            .pipe($.gzip())
            .pipe(gulp.dest('.'));
});

gulp.task('clean', function ()
{
    return gulp
        .src(conf.paths.build, {read : false})
        .pipe($.clean())
});

gulp.task('clean:all', function ()
{
    return gulp
        .src(conf.paths.gen, {read : false})
        .pipe($.clean())
});

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json'])
        // bump the version number in those files
        .pipe($.bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe($.git.commit('bumps package version'))

        // read only one file to get the version number
        .pipe($.filter('package.json'))
        // **tag it in the repository**
        .pipe(tag_version());
}

gulp.task('version:patch', function() { return inc('patch'); });
gulp.task('version:feature', function() { return inc('minor'); });
gulp.task('version:release', function() { return inc('major'); });