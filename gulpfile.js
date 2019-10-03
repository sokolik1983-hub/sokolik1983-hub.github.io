"use strict";


var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("browser-sync");


gulp.task("css", function () {
    return gulp.src("./scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
});

gulp.task('server', function () {
    server.init({
        server: ".",
        notify: false
    });
    gulp.watch("./scss/**/*.scss",gulp.series("css")).on("change", server.reload);
    gulp.watch("*.html").on("change", server.reload);
});

gulp.task("run", gulp.series("server"));