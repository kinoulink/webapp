module.exports = {
    main: {
        options: {
            mode: 'gzip'
        },
        expand: true,
        cwd: '<%= yeoman.dist %>',
        src: ['**/*'],
        dest: '<%= yeoman.dist_gzip %>'
    }
};