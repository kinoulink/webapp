'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    $           = require('gulp-load-plugins')();

var scripts = {
    app:[
            "{APP}/scripts/*.js",
            "{APP}/scripts/filters/*.js",
            "{APP}/scripts/directives/*.js",
            "{APP}/scripts/services/*.js",
            "{APP}/scripts/controllers/*.js"
        ],
    vendor:  [
            "{VENDOR}/ng-file-upload/ng-file-upload-shim.js",
            "{VENDOR}/angular/angular.js",
            "{VENDOR}/angular-route/angular-route.js",
            "{VENDOR}/angular-resource/angular-resource.js",
            "{VENDOR}/angular-sanitize/angular-sanitize.js",
            "{VENDOR}/angular-touch/angular-touch.js",
            "{VENDOR}/ng-file-upload/ng-file-upload.js",
            "{VENDOR}/moment/moment.js",
            "{VENDOR}/angular-loading-bar/build/loading-bar.js",
            "{VENDOR}/angular-bootstrap/ui-bootstrap.js",
            "{VENDOR}/angular-bootstrap/ui-bootstrap-tpls.js",
            "{VENDOR}/angular-ui-notification/dist/angular-ui-notification.js",
            "{VENDOR}/jquery/dist/jquery.js",
            "{VENDOR}/fullcalendar/dist/fullcalendar.min.js",
            "{VENDOR}/angular-ui-calendar/src/calendar.js",
            "{APP}/scripts/vendor/*"
        ]
};

Object.keys(scripts).forEach(function(targetName)
{
    (function(targetName)
    {
        gulp.task('script:' + targetName, function ()
        {
            return processScript(targetName);
        });
    })(targetName);
});

function processScript(script)
{
    if (script === 'app')
    {
        var fs = require('fs');

        fs.access(conf.paths.build, function(err)
        {
            if (err)
            {
                fs.mkdirSync(conf.paths.build);
                fs.mkdirSync(conf.paths.build + '/js');
            }

            var config = {
                api: conf.project.api.url + '/',
                stage: conf.project.stage,
                debug: conf.project.debug,
                version: conf.package.version,
                root: '/'
            };

            fs.writeFileSync(conf.paths.build + '/js/config.js', 'var appConfig = ' + JSON.stringify(config) + ';');
        });
    }

    return  gulp
                .src((scripts[script]).map(function(src)
                {
                    return src
                        .replace('{APP}', conf.paths.src)
                        .replace('{VENDOR}', conf.paths.vendor)
                        ;
                }))
                .pipe($.concat(script + '.js'))
            .pipe($.eslint())
            .pipe($.eslint.format())
            .pipe($.if(conf.project.build.minify, $.ngAnnotate({
            })))
            .pipe($.if(conf.project.build.minify, $.uglify({
                mangle : false,
                preserveComments : false
            })))
            .pipe(gulp.dest(path.join(conf.paths.build, 'js')));
}

gulp.task('scripts', ["script:app", "script:vendor"]);

exports.processScript = processScript;