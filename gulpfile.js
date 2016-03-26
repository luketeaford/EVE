var browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    jslint = require('gulp-jslint'),
    jsonminify = require('gulp-jsonminify'),
    rename = require('gulp-rename'),
    runsequence = require('run-sequence'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),

    scripts = [
        // LICENSE
        'js/legal/_license.js',
        // GENERAL SET-UP
        'js/_eve.js',
        'js/_prompt.js',
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
        'js/_timbreEnv.js',
        // FUNCTIONALITY
        'js/_button.js',
        'js/_calculatePitch.js',
        'js/_keyboard.js',
        'js/_midi.js',
        'js/_program.js',
        'js/_setPitch.js',
        'js/_slider.js',
        'js/_startSynth.js',
        'js/_now.js',
        'js/_gate.js'
    ];

// Should be called serve
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
});

gulp.task('sass', function () {
  return gulp.src('./scss/eve.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
});

gulp.task('watch', function () {
    gulp.watch('./js/**/*.js', ['js']);
    gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('minifyHTML', function () {
  return gulp.src('./dist/*.html')
    .pipe(htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        removeOptionalTags: true
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('minifyJS', function () {
    return gulp.src('./js/eve.js')
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename(function (path) {
            path.extname = '.min.js'
        }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('minifyJSON', function () {
    return gulp.src('./presets/*.json')
        .pipe(jsonminify())
        .pipe(gulp.dest('./dist/presets'))
});

gulp.task('minifyCSS', function () {
    return gulp.src('./scss/eve.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename(function (path) {
            path.extname = '.min.css'
        }))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('htmlreplace', function() {
  return gulp.src('./index.html')
    .pipe(htmlreplace({
        'css': 'css/eve.min.css',
        'js': 'js/eve.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', [
    'browsersync',
    'build',
    'watch'
]);

gulp.task('build', [
    'js',
    'sass'
]);

gulp.task('minify', [
    'minifyCSS',
    'minifyHTML',
    'minifyJS',
    'minifyJSON'
]);

gulp.task('release', function (callback) {
    runsequence(
        ['build', 'htmlreplace'],
        'minify',
        callback);
});
