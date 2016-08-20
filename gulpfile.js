var gulp            = require('gulp'),
    connect         = require('gulp-connect'),
    csslint         = require('gulp-csslint'),
    jshint          = require('gulp-jshint'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCSS        = require('gulp-clean-css'),
    stylish         = require('jshint-stylish');

gulp.task('csslint', function () {
    return gulp.src('src/imagelightbox.css')
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.formatter())
});

gulp.task('minify:css', function () {
    return gulp.src('src/imagelightbox.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Firefox ESR', 'Android >= 2.3'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename('imagelightbox.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('jshint', function () {
    return gulp.src('src/imagelightbox.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('minify:js', function () {
    return gulp.src('src/imagelightbox.js')
        .pipe(uglify())
        .pipe(rename('imagelightbox.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('default', ['csslint', 'minify:css', 'jshint', 'minify:js']);
