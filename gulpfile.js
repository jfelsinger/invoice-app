'use strict';
// var LIVERELOAD_PORT = 4500;

var gulp = require('gulp'),
    bower = require('gulp-bower'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    htmlmin = require('gulp-htmlmin'),
    rimraf = require('gulp-rimraf'),
    notify = require('gulp-notify'),
    nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha');


// Configuration Directories
var dir = {
    app: 'app',
    client: 'client',
    dist: 'dist'
};

gulp.task('rimraf', function() {
    return gulp.src(dir.dist, {read: false})
        .pipe(rimraf());
});

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(dir.client + '/scripts/vendor'));
});

gulp.task('bower-styles', function() {
    return bower({
        cwd: './client/styles'
    });
});

gulp.task('styles', ['bower-styles'], function() {
    return gulp.src(dir.client + '/styles/*.{scss,sass}')
        .pipe(compass({
            style: 'expanded',
            css: dir.client + '/styles',
            sass: dir.client + '/styles',
            require: []
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dir.client + '/styles'))

        .pipe(minifycss())
        .pipe(gulp.dest(dir.dist + '/styles'))

        .pipe(notify({message: 'Styles task complete' }));
});

gulp.task('clientScripts', function() {
    return gulp.src([
            dir.client + '/scripts/**/*.js',
            '!' + dir.client + '/scripts/models/**',
            '!' + dir.client + '/scripts/view-models/**',
            '!' + dir.client + '/scripts/lib/**',
            '!' + dir.client + '/scripts/vendor/**',
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(browserify())
        .pipe(gulp.dest(dir.client + '/dist/scripts'))

        .pipe(uglify())
        .pipe(gulp.dest(dir.dist + '/scripts'))

        .pipe(notify({ message: 'Client scripts task complete' }));
});

gulp.task('images', function() {
    return gulp.src(dir.client + '/images/{,*/}*.{png,jpg,jpeg}')
        .pipe(
            imagemin({ 
                optimizationLevel: 3, 
                progressive: true, 
                interlaced: true 
            }))
        .pipe(gulp.dest(dir.dist + '/images/'))

        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('svg', function() {
    return gulp.src(dir.client + '/images/{,*/}*.svg')
        .pipe(
            svgmin()
        )
        .pipe(gulp.dest(dir.dist + '/images/'))

        .pipe(notify({ message: 'SVG task complete' }));
});

gulp.task('html', function() {
    return gulp.src(dir.client + '/{,*/}*.{html,htm}')
        .pipe(
            htmlmin({
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseBooleanAttributes: true,
                removeRedundentAttributes: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            })
        )
        .pipe(gulp.dest(dir.dist))

        .pipe(notify({ message: 'HTML task complete' }));
});

gulp.task('watch', ['app', 'client'], function() {

    // Watch styles
    gulp.watch(dir.client + '/styles/{,*/}*.{sass,scss}', ['styles']);

    // Watch client scripts
    gulp.watch(dir.client + '/scripts/{,*/}*.js', ['clientScripts']);

    // Watch server scripts
    gulp.watch(dir.app + '/{,*/}*.js', ['app-restart']);

    // Watch image files
    gulp.watch(dir.client + '/images/{,*/}*.{png,jpg,jpeg}', ['images']);

    // Watch svg files
    gulp.watch(dir.client + '/images/{,*/}*.svg', ['svg']);

    // Watch html files
    gulp.watch(dir.client + '/{,*/}*.{html,htm}', ['html']);

});

gulp.task('mocha', function() {
    gulp.src('./test/{,*/}*.js')
        .pipe(mocha({ reporter: 'list' }));
});

gulp.task('lint', function() {
    return gulp.src([
            'gulpfile.js',
            '<%= yeoman.app %>/{,*/}*.js',
            '<%= yeoman.config %>/{,*/}*.js',
            'test/{,*/}*.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'Linting task complete' }));
});

gulp.task('client', ['rimraf', 'bower'], function() {
    gulp.start('styles', 'clientScripts', 'images', 'svg', 'html');
});

gulp.task('test', ['lint', 'mocha']);

gulp.task('app', function() {
    return nodemon({
            script: 'server.js',
            ignore: [
                'README.md', 
                'node_modules/**',
                dir.client,
                dir.dist
            ],
            watchedExtensions: ['js'],
            watchedFolders: [dir.app, 'config'],
            debug: true,
            delayTime: 1,
            env: {
                PORT: 3000
            },
        })
        .on('restart', ['test']);
});

// Restart the app server
gulp.task('app-restart', function() {
    nodemon.emit('restart');
});

/** Build it all up and serve it */
gulp.task('default', ['watch']);

// /** Build it all up and serve the production version */
// gulp.task('serve', ['app', 'client', 'watch']);
