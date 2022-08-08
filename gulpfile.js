var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCSS        = require('gulp-clean-css'),
    concat          = require('gulp-concat'),
    connect         = require('gulp-connect'),
    rename          = require('gulp-rename'),
    ts              = require('gulp-typescript'),
    uglify          = require('gulp-uglify');

gulp.task('copy:css', function() {
    return gulp.src('src/imagelightbox.css')
        .pipe(gulp.dest('docs/stylesheets/'));
});

gulp.task('minify:css', gulp.series('copy:css', function() {
    return gulp.src('src/imagelightbox.css')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename('imagelightbox.min.css'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('copy:js', function() {
    var tsProject = ts.createProject('tsconfig.json');
    return gulp.src(['src/**/*.ts'])
        .pipe(tsProject()).js
        .pipe(concat('imagelightbox.js'))
        .pipe(gulp.dest('docs/javascripts/'));
});

gulp.task('minify:js', gulp.series('copy:js', function() {
    var tsProject = ts.createProject('tsconfig.json');
    return gulp.src(['src/**/*.ts'])
        .pipe(tsProject()).js
        .pipe(concat('imagelightbox.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
}));

gulp.task('build', gulp.parallel('minify:css', 'minify:js'));

gulp.task('watch', function(done) {
    gulp.watch(['docs/*.html','src/**/*'], gulp.series('build'));
    done();
});

gulp.task('dev', gulp.parallel('build', 'watch', function(done) {
    connect.server({
        livereload: true
    });
    done();
}));

gulp.task('default', gulp.series('build'));
