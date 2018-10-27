var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCSS        = require('gulp-clean-css'),
    connect         = require('gulp-connect'),
    csslint         = require('gulp-csslint'),
    eslint          = require('gulp-eslint'),
    lintspaces      = require('gulp-lintspaces'),
    nightwatch      = require('gulp-nightwatch'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify');

gulp.task('csslint', function() {
    return gulp.src('src/imagelightbox.css')
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.formatter());
});

gulp.task('copy:css', gulp.series('csslint', function() {
    return gulp.src('src/imagelightbox.css')
        .pipe(gulp.dest('docs/stylesheets/'));
}));

gulp.task('minify:css', gulp.series('copy:css', function() {
    return gulp.src('src/imagelightbox.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Firefox ESR', 'Android >= 2.3'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename('imagelightbox.min.css'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('editorconfig', function() {
    return gulp.src('src/imagelightbox.js')
        .pipe(lintspaces({editorconfig: './.editorconfig'}))
        .pipe(lintspaces.reporter());
});

gulp.task('eslint', function() {
    return gulp.src('src/imagelightbox.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('copy:js',  gulp.series('editorconfig', 'eslint', function() {
    return gulp.src('src/imagelightbox.js')
        .pipe(gulp.dest('docs/javascripts/'));
}));

gulp.task('minify:js', gulp.series('copy:js', function() {
    return gulp.src('src/imagelightbox.js')
        .pipe(uglify())
        .pipe(rename('imagelightbox.min.js'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('build', gulp.parallel('minify:css', 'minify:js'));

gulp.task('watch', function(done) {
    gulp.watch(['docs/*.html','src/**/*'], gulp.series('build'));
    done();
});

gulp.task('selenium:start', function(done) {
    connect.server({
        livereload: true
    });
    done();
});

gulp.task('selenium:stop', function(done) {
    connect.serverClose();
    done();
});

gulp.task('serve', gulp.parallel('build', 'watch', 'selenium:start'));

gulp.task('night:js', gulp.series(gulp.parallel('build', 'selenium:start'), function() {
    return gulp.src('./gulpfile.js')
        .pipe(nightwatch({
            configFile: './nightwatch.json.js'
        }));}, 'selenium:stop'));

gulp.task('default', gulp.series('build'));

gulp.task('dev', gulp.series('serve'));

gulp.task('test', gulp.series('night:js'));
