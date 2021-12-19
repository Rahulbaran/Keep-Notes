const { src, dest, series, watch } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const prefixer = require("autoprefixer");
const terser = require("gulp-terser");
const srcMaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

//scss Task
const scssTask = function () {
    return src("dist/scss/*.scss")
        .pipe(scss())
        .pipe(srcMaps.init())
        .pipe(postcss([cssnano(), prefixer]))
        .pipe(srcMaps.write("."))
        .pipe(dest("./dist/css"));
};

//js Task
const jsTask = function () {
    return src("dist/js/*.js")
        .pipe(srcMaps.init())
        .pipe(terser())
        .pipe(srcMaps.write("."))
        .pipe(dest("./dist/minjs"));
};

//browser serve task
const serveBrowser = function (start) {
    browserSync.init({
        server: "./dist/",
        port: 5050,
        logLevel: "debug",
        browser: "brave",
    });
    start();
};

//reload Browser Task
const reloadBrowser = function (start) {
    browserSync.reload();
    start();
};

//watch Task
const watchTask = function () {
    watch("./dist/*.html", reloadBrowser);
    watch("./dist/scss/*.scss", series(scssTask, reloadBrowser));
    watch("./dist/js/*.js", series(jsTask, reloadBrowser));
};

exports.default = series(scssTask, jsTask, serveBrowser, watchTask);
