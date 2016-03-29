var browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    htmlReplace = require('gulp-html-replace'),
    imagemin = require('gulp-imagemin'),
    jslint = require('gulp-jslint'),
    jsonminify = require('gulp-jsonminify'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
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
    ],

    specialFiles = [
        './dist/img/apple-touch-icon.png'
    ];

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

gulp.task('htmlReplace', function() {
  return gulp.src('./index.html')
    .pipe(htmlReplace({
        'css': 'css/eve.min.css',
        'js': 'js/eve.min.js'
    }))
    .pipe(gulp.dest('./dist'));
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

gulp.task('minifyImages', function () {
    return gulp.src('./img/*.*')
        .pipe(imagemin({
            optimizationLevel: 3
        }))
        .pipe(gulp.dest('./dist/img'))
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

gulp.task('minifyManifest', function () {
    return gulp.src('./manifest.appcache')
        .pipe(gulp.dest('./dist'))
});

gulp.task('moveFilesToRoot', function (done) {
    gulp.src(specialFiles)
        .pipe(gulp.dest('./dist'))
        del(specialFiles)
});

gulp.task('sass', function () {
  return gulp.src('./scss/eve.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', function () {
    gulp.watch('./js/**/*.js', ['js']);
    gulp.watch('./scss/**/*.scss', ['sass']);
});

// CONVENIENT ALIASES FOR RELATED TASKS
gulp.task('build', [
    'js',
    'sass'
]);

gulp.task('default', [
    'build',
    'serve',
    'watch'
]);

gulp.task('minify', [
    'minifyCSS',
    'minifyHTML',
    'minifyImages',
    'minifyJS',
    'minifyJSON',
    'minifyManifest'
]);

gulp.task('release', function (done) {
    runSequence(
        ['build', 'htmlReplace'],
        'minify',
        'moveFilesToRoot',
        done);
});
