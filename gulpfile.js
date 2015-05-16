var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    jslint = require('gulp-jslint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),

    scripts = [
        // LEGAL
        //'js/_license.js',

        // SYNTH
        'js/_eve.js',
        'js/_collapse-modules.js',
        'js/_keyboard.js',
        'js/_config.js',
        'js/_program.js',
        'js/_envelope-helpers.js',
        'js/_build-synth.js',
        'js/_build-scope.js',
        'js/_connect-synth.js',
        'js/_calculate-pitch.js',
        'js/_gateon.js',
        'js/_gateoff.js'

    ];

gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('js', function () {
    return gulp.src(scripts)
    .pipe(concat('eve.js'))
    .pipe(gulp.dest('js'))
    .pipe(jslint({
        browser: true,
        devel: true,
        predef: [
            '$',
            'AudioContext',
            'CustomEvent',
            'Event',
            'Float32Array',
            'Uint8Array'
        ],
        todo: true
    }))
    .pipe(uglify())
    .pipe(gulp.dest('eve/js'))
});

gulp.task('sass', function() {
    return sass('css/eve.scss', {
        noCache: true,
        precision: 11,
        style: 'compressed'
    })
    .on('error', function (err) {
        console.error(err.message);
    })
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('eve/css'));
});

gulp.task('watch', function () {
    gulp.watch('js/*.js', ['js']);
    gulp.watch('css/**/*.scss', ['sass']);
});

gulp.task('default', ['js', 'watch', 'browsersync']);
