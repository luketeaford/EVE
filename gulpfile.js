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
        'src/legal/_license.js',
        // GENERAL SET-UP
        'src/_eve.js',
        'src/_prompt.js',
        'src/_events.js',
        'src/_config.js',
        'src/_preset.js',
        // SYNTH
        'src/_oscilloscope.js',
        'src/_vca.js',
        'src/_harmonicOscillator.js',
        'src/_lfo.js',
        'src/_lfo1.js',
        'src/_lfo2.js',
        'src/_performance.js',
        'src/_timbreEnv.js',
        // FUNCTIONALITY
        'src/_button.js',
        'src/_calculatePitch.js',
        'src/_keyboard.js',
        'src/_midi.js',
        'src/_navigation.js',
        'src/_program.js',
        'src/_setPitch.js',
        'src/_slider.js',
        'src/_startSynth.js',
        'src/_now.js',
        'src/_gate.js'
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

gulp.task('copyManifest', function () {
    return gulp.src('./manifest.appcache')
        .pipe(gulp.dest('./dist'))
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
    return gulp.src('./src/eve.js')
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
    gulp.watch('./src/**/*.js', ['js']);
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
    'minifyJSON'
]);

gulp.task('release', function (done) {
    runSequence(
        ['build', 'htmlReplace'],
        'minify',
        'copyManifest',
        'moveFilesToRoot',
        done);
});
