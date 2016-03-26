'use strict';

var path        = require('path'),
    gulp        = require('gulp'),
    conf        = require('./conf'),
    $           = require('gulp-load-plugins')();

exports.bindConfiguration = function(stream)
{
    /*var replaces = {
        'API_LINK' : conf.project.api.url,
        'MESSENGER_LINK' : conf.project.messenger.url
    };

    Object.keys(replaces).forEach(function(key)
    {
        stream = stream.pipe($.replace('{' + key + '}', replaces[key]));
    });*/

    return stream;
};