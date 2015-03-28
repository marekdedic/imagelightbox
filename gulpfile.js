var gulp            = require('gulp'),
    csslint         = require('gulp-csslint'),
    jshint          = require('gulp-jshint'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify'),
    autoprefixer    = require('gulp-autoprefixer'),
    minifyCSS       = require('gulp-minify-css'),
    stylish         = require('jshint-stylish');

gulp.task('csslint', function () {
    return gulp.src('src/imagelightbox.css')
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.reporter())
});

gulp.task('minify:css', function () {
    return gulp.src('src/imagelightbox.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 7', 'Firefox ESR', 'Android >= 2.3'],
            cascade: false
        }))
        .pipe(minifyCSS())
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

gulp.task('default', ['csslint', 'minify:css', 'jshint', 'minify:js']);