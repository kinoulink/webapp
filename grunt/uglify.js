module.exports = {
    options: {
        sourceMap: true,
        mangle: true,
        banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %> */"
    },
    dist: {
        expand: true,
        cwd: "<%= yeoman.tmp %>/scripts",
        src: "*.js",
        dest: "<%= yeoman.dist %>/scripts"
    },
    cordova: {
        mangle : false
    }
};