/* eslint-env node */

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const connect = require("gulp-connect");
const rename = require("gulp-rename");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");

gulp.task("build:css:copy", function () {
    return gulp
        .src("src/imagelightbox.css")
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest("docs/stylesheets/"));
});

gulp.task("build:css:minify", function () {
    return gulp
        .src("dist/imagelightbox.css")
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("build:css", gulp.series("build:css:copy", "build:css:minify"));

gulp.task("copy:js", function () {
    var tsProject = ts.createProject("tsconfig.json");
    return gulp
        .src(["src/**/*.ts", "types/**/*.ts"])
        .pipe(tsProject())
        .js.pipe(concat("imagelightbox.js"))
        .pipe(gulp.dest("docs/javascripts/"));
});

gulp.task(
    "minify:js",
    gulp.series("copy:js", function () {
        var tsProject = ts.createProject("tsconfig.json");
        return gulp
            .src(["src/**/*.ts", "types/**/*.ts"])
            .pipe(tsProject())
            .js.pipe(concat("imagelightbox.min.js"))
            .pipe(uglify())
            .pipe(gulp.dest("dist/"));
    })
);

gulp.task("build", gulp.parallel("build:css", "minify:js"));

gulp.task("watch", function (done) {
    gulp.watch(["docs/*.html", "src/**/*"], gulp.series("build"));
    done();
});

gulp.task(
    "dev",
    gulp.parallel("build", "watch", function (done) {
        connect.server({
            livereload: true,
        });
        done();
    })
);

gulp.task("default", gulp.series("build"));
