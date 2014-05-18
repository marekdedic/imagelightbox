var gulp    = require('gulp');
var csslint = require('gulp-csslint');
var jshint  = require('gulp-jshint');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var stylish = require('jshint-stylish');

gulp.task('csslint', function () {
    return gulp.src('imagelightbox.js')
        .pipe(csslint())
        .pipe(csslint.reporter())
});

gulp.task('jshint', function () {
    return gulp.src('imagelightbox.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('minify', function () {
    return gulp.src('imagelightbox.js')
        .pipe(uglify())
        .pipe(rename('imagelightbox.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['jshint', 'minify']);