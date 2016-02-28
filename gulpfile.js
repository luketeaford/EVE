var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    jslint = require('gulp-jslint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),

    scripts = [
        // LICENSE
        'js/legal/_license.js',
        // GENERAL SET-UP
        'js/temp/_prefixWebAudio.js',
        'js/_eve.js',
        'js/_events.js',
        'js/_config.js',
        'js/_preset.js',
        // SYNTH
        'js/_oscilloscope.js',
        'js/_vca.js',
        'js/_harmonicOscillator.js',
        'js/_lfo1.js',
        'js/_lfo2.js',
        'js/_performance.js',
        'js/_timbreEg.js',
        'js/_timbreEnv.js',
        // FUNCTIONALITY
        'js/_button.js',
        'js/_calculatePitch.js',
            'js/_envelopes.js',// currently unused
        'js/_keyboard.js',
            'js/_midi.js',
        'js/_program.js',
        'js/_setPitch.js',
        'js/_slider.js',
        'js/_startSynth.js',
        'js/_now.js',
        'js/_gate.js',
        'js/_calculatePitch.js'
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
  gulp.src('scss/eve.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('eve/css'));
});

gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('default', [
    'browsersync',
    'js',
    'sass',
    'watch'
]);
