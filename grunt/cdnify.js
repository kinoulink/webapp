module.exports = {
    main: {
        options: {
            base: 'http://dcouqmluyy0vf.cloudfront.net/'
        },
        files: [{
            expand: true,
            cwd: 'dist/plain',
            src: 'index.html',
            dest: 'dist/plain'
        }]
    }
};