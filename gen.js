var json = {
    watch: {
        js: {
            files: ['<%= yeoman.app %>/scripts/{,*/}*.js', '<%= yeoman.common %>/js/{,*/}*.js'],
            tasks: ['concat']
        },
        compass: {
            files: ['<%= yeoman.app %>/styles/scss/{,*/}*.scss'],
            tasks: ['compass:server', 'autoprefixer', 'concat'],
        },
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
                '<%= yeoman.app %>/{,*/}*.html',
                '<%= yeoman.app %>/views/{,*/}*.html',
                '.tmp/styles/{,*/}*.css',
                '.tmp/scripts/*.js',
                '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    },

    // The actual grunt server settings
    connect: {
        options: {
            port: 8000,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost',
            livereload: 35729
        },
        livereload: {
            options: {
                open: true,
                middleware: function (connect) {
                    return [
                        connect.static('.tmp'),
                        connect().use(
                            '/bower_components',
                            connect.static('./bower_components')
                        ),
                        connect.static(appConfig.app)
                    ];
                }
            }
        },
        test: {
            options: {
                port: 9001,
                middleware: function (connect) {
                    return [
                        connect.static('.tmp'),
                        connect.static('test'),
                        connect().use(
                            '/bower_components',
                            connect.static('./bower_components')
                        ),
                        connect.static(appConfig.app)
                    ];
                }
            }
        },
        dist: {
            options: {
                open: true,
                base: '<%= yeoman.dist %>'
            }
        }
    },

    // Empties folders to start fresh
    clean: {
        dist: {
            files: [{
                dot: true,
                src: [
                    '.tmp',
                    '<%= yeoman.dist %>/{,*/}*',
                    '!<%= yeoman.dist %>/.git*'
                ]
            }]
        },
        server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
        options: {
            browsers: ['last 1 version']
        },
        dist: {
            files: [{
                expand: true,
                cwd: '.tmp/styles/',
                src: '*.css',
                dest: '.tmp/styles/'
            }]
        }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
        options: {
            sassDir: '<%= yeoman.app %>/styles/scss',
            cssDir: '.tmp/styles/scss',
            generatedImagesDir: '.tmp/images/generated',
            imagesDir: '<%= yeoman.app %>/images',
            javascriptsDir: '<%= yeoman.app %>/scripts',
            fontsDir: '<%= yeoman.app %>/styles/fonts',
            importPath: './bower_components',
            httpImagesPath: '/images',
            httpGeneratedImagesPath: '/images/generated',
            httpFontsPath: '/styles/fonts',
            relativeAssets: false,
            assetCacheBuster: false,
            raw: 'Sass::Script::Number.precision = 10\n'
        },
        dist: {
            options: {
                generatedImagesDir: '<%= yeoman.dist %>/images/generated'
            }
        },
        server: {
            options: {
                debugInfo: false
            }
        }
    },

    concat: {
        js_bizlunch: {
            src: [
                '<%= yeoman.app %>/scripts/app.js',
                '<%= yeoman.app %>/scripts/services/*',
                '<%= yeoman.common %>/js/controllers/*',
                '<%= yeoman.common %>/js/services/*',
                '<%= yeoman.common %>/js/directives/*'
            ],
            dest: '<%= yeoman.tmp %>/scripts/bizlunch.js'
        },
        js_vendor: {
            src: [
                '<%= yeoman.vendor %>/ng-file-upload/angular-file-upload-shim.js',
                '<%= yeoman.vendor %>/angular/angular.js',
                '<%= yeoman.vendor %>/angular-route/angular-route.js',
                '<%= yeoman.vendor %>/angular-resource/angular-resource.js',
                '<%= yeoman.vendor %>/angular-sanitize/angular-sanitize.js',
                '<%= yeoman.vendor %>/ng-file-upload/angular-file-upload.js',
                '<%= yeoman.common %>/js/vendor/*',
                '<%= yeoman.vendor %>/angular-socket-io/socket.js',
                '<%= yeoman.vendor %>/moment/moment.js',
                '<%= yeoman.vendor %>/moment/locale/fr.js',
                '<%= yeoman.vendor %>/angular-loading-bar/build/loading-bar.js'
            ],
            dest: '<%= yeoman.tmp %>/scripts/vendor.js'
        },
        css_bizlunch: {
            src: '<%= yeoman.tmp %>/styles/scss/bizlunch/*.css',
            dest: '<%= yeoman.tmp %>/styles/bizlunch.css'
        },
        css_vendor: {
            src: [
                '<%= yeoman.tmp %>/styles/scss/vendor/*.css'
            ],
            dest: '<%= yeoman.tmp %>/styles/vendor.css'
        }
    },

    cssmin: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.tmp %>/styles',
                src: '*.css',
                dest: '<%= yeoman.dist %>/styles'
            }]
        }
    },

    uglify: {
        options: {
            sourceMap: false,
            mangle: true,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        dist: {
            expand: true,
            cwd: '<%= yeoman.tmp %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
        }
    },

    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/images',
                src: '{,*/}*.{png,jpg,jpeg,gif}',
                dest: '<%= yeoman.dist %>/images'
            }]
        }
    },

    svgmin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/images',
                src: '{,*/}*.svg',
                dest: '<%= yeoman.dist %>/images'
            }]
        }
    },

    htmlmin: {
        dist: {
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true
            },
            files: [{
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['*.html', 'views/{,*/}*.html'],
                dest: '<%= yeoman.dist %>'
            }]
        }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
        dist: {
            files: [{
                expand: true,
                cwd: '.tmp/scripts',
                src: '*.js',
                dest: '.tmp/scripts'
            }]
        }
    },

    // Replace Google CDN references
    cdnify: {
        dist: {
            html: ['<%= yeoman.dist %>/*.html']
        }
    },

    // Copies remaining files to places other tasks can use
    copy: {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>',
                src: [
                    '*.{ico,png,txt}',
                    '*.config',
                    '*.html',
                    'views/{,*/}*.html',
                    'images/{,*/}*.{webp}',
                    'fonts/*',
                    'sounds/*'
                ]
            }, {
                expand: true,
                cwd: '.tmp/images',
                dest: '<%= yeoman.dist %>/images',
                src: ['generated/*']
            }
            ]
        }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
        server: [
            'compass:server'
        ],
        test: [
            'compass'
        ],
        dist: [
            'cssmin',
            'uglify',
            'imagemin'
        ]
    },

    filerev: {
        dist: {
            src: [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css'
            ]
        }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
        html: ['<%= yeoman.dist %>/index.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        options: {
            assetsDirs: ['<%= yeoman.dist %>']
        }
    },

    exec: {
        git_push: 'git add . --all && git commit -am "Work work" && git push'
    }
};

var fs = require('fs');

for (var i in json)
{
    var buffer = JSON.stringify(json[i], null, 4);

    buffer = buffer.replace(/\"([^(\")"]+)\":/g,"$1:");

    buffer = 'module.exports = ' + buffer + ';';

    fs.writeFileSync('./grunt/' + i + '.js', buffer);
}