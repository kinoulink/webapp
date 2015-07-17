module.exports = {
    js_kinoulink: {
        src: [
            "<%= yeoman.app %>/scripts/generate.js",
            "<%= yeoman.app %>/scripts/app.js",
            "<%= yeoman.app %>/scripts/filters/*.js",
            "<%= yeoman.app %>/scripts/directives/*.js",
            "<%= yeoman.app %>/scripts/services/*.js",
            "<%= yeoman.app %>/scripts/controllers/*.js",
        ],
        dest: "<%= yeoman.tmp %>/scripts/kinoulink.js"
    },
    js_vendor: {
        src: [
            "<%= yeoman.vendor %>/ng-file-upload/angular-file-upload-shim.js",
            "<%= yeoman.vendor %>/angular/angular.js",
            "<%= yeoman.vendor %>/angular-route/angular-route.js",
            "<%= yeoman.vendor %>/angular-resource/angular-resource.js",
            "<%= yeoman.vendor %>/angular-sanitize/angular-sanitize.js",
            "<%= yeoman.vendor %>/ng-file-upload/angular-file-upload.js",
            "<%= yeoman.vendor %>/moment/moment.js",
            "<%= yeoman.vendor %>/angular-loading-bar/build/loading-bar.js",
            "<%= yeoman.app %>/scripts/vendor/*"
        ],
        dest: "<%= yeoman.tmp %>/scripts/vendor.js"
    },
    js_cordova: {
        src: [
            "<%= yeoman.app %>/scripts/cordova/*.js",
            "<%= yeoman.cordova.plugins %>/com.phonegap.plugins.PushPlugin/www/PushNotification.js"
            ],
        dest: "<%= yeoman.tmp %>/scripts/webapp.js"
    },
    css_kinoulink: {
        src: "<%= yeoman.tmp %>/styles/kinoulink/*.css",
        dest: "<%= yeoman.tmp %>/styles/kinoulink.css"
    },
    css_vendor: {
        src: [
            "<%= yeoman.tmp %>/styles/vendor/*.css"
        ],
        dest: "<%= yeoman.tmp %>/styles/vendor.css"
    },
    css_cordova: {
        src: "<%= yeoman.tmp %>/styles/cordova/*.css",
        dest : "<%= yeoman.tmp %>/styles/webapp.css"
    }
};