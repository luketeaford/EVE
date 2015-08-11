var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    jslint = require('gulp-jslint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),

    scripts = [
        // LEGAL
        //'js/_legal/_license.js',

        // SYNTH
        'js/_eve.js',
        'js/_collapseModules.js',
        'js/_keyboard.js',
        'js/_program.js',
        'js/_envelopes.js',
        'js/_synth/_oscilloscope.js',
        'js/_synth/_vca.js',
        'js/_synth/_harmonicOsc.js',
        'js/_synth/_timbreEg.js',
        'js/_synth/_timbreEnv.js',
        'js/_synth/_lfo1.js',
        'js/_synth/_lfo2.js',
        'js/_synth/_performance.js',// MIGHT NOT BELONG HERE
        'js/_startSynth.js',
        'js/_sliders.js',
        'js/_buttons.js',
        'js/_calculatePitch.js',
        'js/_setPitch.js',
        'js/_gateOn.js',
        'js/_gateOff.js',
        'js/_midi.js'
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

gulp.task('sass', function () {
  gulp.src('css/eve.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('eve/css'));
});

gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('css/**/*.scss', ['sass']);
});

gulp.task('default', ['js', 'watch', 'browsersync']);
