/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util'),
    minimist = require('minimist'),
    fs = require('fs');

var cliOptions = minimist(process.argv.slice(2), {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'local'}
});

if (["dev", "prod", "local"].indexOf(cliOptions.env) === -1)
{
    console.log("<!> env must be dev, prod, local <!>");

    return -1;
}

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
    src: 'app',
    dist: 'gen/build',
    tmp: 'gen/.tmp',
    e2e: 'e2e',
    vendor: 'bower_components'
};

exports.project = JSON.parse(fs.readFileSync('./config/' + cliOptions.env + '.json'));

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title)
{
    'use strict';

    return function (err)
    {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
