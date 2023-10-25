/* eslint-env node */

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const connect = require("gulp-connect");
const named = require("vinyl-named");
const rename = require("gulp-rename");
const webpack = require("webpack-stream");

gulp.task("build:css:copy", () =>
    gulp
        .src("src/imagelightbox.css")
        .pipe(
            autoprefixer({
                cascade: false,
            }),
        )
        .pipe(gulp.dest("dist/"))
        .pipe(gulp.dest("docs/stylesheets/")),
);

gulp.task("build:css:minify", () =>
    gulp
        .src("dist/imagelightbox.css")
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/")),
);

gulp.task("build:css", gulp.series("build:css:copy", "build:css:minify"));

gulp.task("build:js", () =>
    gulp
        .src("src/imagelightbox.ts")
        .pipe(named((file) => file.stem + ".min"))
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest("dist/"))
        .pipe(gulp.dest("docs/javascripts/")),
);

gulp.task("build", gulp.parallel("build:css", "build:js"));

gulp.task("watch", (done) => {
    gulp.watch(["docs/*.html", "src/**/*"], gulp.series("build"));
    done();
});

gulp.task(
    "dev",
    gulp.parallel("build", "watch", (done) => {
        connect.server({
            livereload: true,
        });
        done();
    }),
);

gulp.task("default", gulp.series("build"));
