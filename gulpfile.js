var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    jslint = require('gulp-jslint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),

    scripts = [
    //    'js/_license.js',
        'js/_eve.js',
        'js/templates/*.js',
        'js/_customevents.js',
        'js/_buildsynth.js',
        'js/_startsynth.js',
        'js/_gateon.js',
        'js/_gateoff.js',
        'js/_calculatepitch.js',
        'js/_temp.js',
        'js/_router.js'
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
        ]
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
