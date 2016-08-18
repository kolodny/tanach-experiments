var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var es = require('event-stream');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var inject = require('gulp-inject');

//CLEAN
gulp.task('clean', function() {
    return del([
        'dist',
        './src/*-dev.html',
    ]);

});

//DIST
gulp.task('dist', function() {
    runSequence('clean', 'js-dist', 'copy-dist', 'html-dist');
});

gulp.task('js-dist', function() {
    return es.merge([
        gulp.src(path.join('./src/js/modules/image-generator/', '**/*.js'))
        .pipe(concat('image-generator.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js')),
        gulp.src(path.join('./src/js/core/', '**/*.js'))
        .pipe(concat('tanach-core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js')),
    ]);
});

gulp.task('copy-dist', function() {
    return es.merge([
        gulp.src('./src/media/**/*').pipe(gulp.dest('./dist/media/')), //static stuff
        gulp.src('./src/external-libs/**/*').pipe(gulp.dest('./dist/external-libs/')), //static stuff
        gulp.src('./src/css/**/*.css').pipe(cleanCSS({
            compatibility: 'ie8'
        })).pipe(gulp.dest('./dist/css')), //css
    ])
});

gulp.task('html-dist', function() {
    var target = gulp.src('./src/html/image-generator-template.html');
    var sources = gulp.src(['./dist/js/**/*.js', './dist/css/**/*.css'], {
        read: false
    });

    target.pipe(inject(sources, {
        ignorePath: 'dist',
        addRootSlash: false
    })).pipe(rename('image-generator.html')).pipe(gulp.dest('./dist'));
});



gulp.task('clean-temp-dist', function() {
    return del([
        'dist-temp',
    ]);
});


//Build HTML Template for DEV
gulp.task('clean-html-dev', function() {
    return del([
        './src/*-dev.html',
    ]);
});

gulp.task('make-html-dev', function() {
    var target = gulp.src('./src/html/image-generator-template.html');
    var sources = gulp.src(['./src/js/**/*.js', './src/css/**/*.css'], {
        read: false
    });

    target.pipe(inject(sources, {
        ignorePath: 'src',
        addRootSlash: false
    })).pipe(rename('image-generator-dev.html')).pipe(gulp.dest('./src'));
});

gulp.task('build-html-dev', function() {
    runSequence('clean-html-dev', 'make-html-dev');
});

//WATCH

gulp.task('watch-html', ['build-html-dev'], function() {
    gulp.src('./src/html/**/*.html').pipe(connect.reload());
});

gulp.task('watch-media', function() {
    gulp.src('./src/media/**/*').pipe(connect.reload());
});

gulp.task('watch-external-libs', ['build-html-dev'], function() {
    gulp.src('./src/external-libs/**/*').pipe(connect.reload());
});

gulp.task('watch-css', ['build-html-dev'], function() {
    gulp.src('./src/css/**/*.css').pipe(connect.reload());
});

gulp.task('watch-js', ['build-html-dev'], function() {
    gulp.src('./src/js/**/*.js').pipe(connect.reload());
});

//DEV-WATCH
gulp.task('watch', function() {
    gulp.watch(['html/**/*.html'], {
        cwd: 'src'
    }, ['watch-html']);
    gulp.watch(['media/**/*'], {
        cwd: 'src'
    }, ['watch-media']);
    gulp.watch(['external-libs/**/*'], {
        cwd: 'src'
    }, ['watch-external-libs']);
    gulp.watch(['css/**/*.css'], {
        cwd: 'src'
    }, ['watch-css']);
    gulp.watch(['js/**/*.js'], {
        cwd: 'src'
    }, ['watch-js']);
});

//CONNECT
gulp.task('connect', function() {
    connect.server({
        root: 'src',
        livereload: true
    });
});

//MAIN
gulp.task('default', ['build-html-dev', 'connect', 'watch']);
