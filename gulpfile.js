"use strict";

const gulp = require("gulp");
const del = require('del');
const browsersync = require("browser-sync").create();
const headerfooter = require('gulp-headerfooter');
const htmlmin = require('gulp-htmlmin');

// BrowserSync
function startBrowsersync(done) {
    browsersync.init({
        server: {
            baseDir: "dist/"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function reloadBrowserSync(done) {
    browsersync.reload();
    done();
}

// Clean dist folder
function clean() {
    console.info('Cleaning...');
    return del(["./dist/**/*"]);
}

// copy assets:
function copyAssets() {
    console.info('copy assets...');
    return gulp
        .src(['src/assets/**/*'], {base: 'src/assets'})
        .pipe(gulp.dest('dist/assets'));
}

// build: concatinate for each html  header & content & footer:
function build() {
    console.info('build...');
    return gulp
        .src(['src/**/*.html', '!src/footer.html', '!src/header.html'])
        .pipe(headerfooter.header('src/header.html'))
        .pipe(headerfooter.footer('src/footer.html'))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCss: true,
            minifyJs: true
        }))
        .pipe(gulp.dest('dist'));
}

// Watch files
function watchFiles() {
    gulp.watch("./dist/**/*", reloadBrowserSync);
    gulp.watch("./src/**/*", build);
}


const cleanAndCopyAssetsAndBuild = gulp.series(clean, copyAssets, build);
const serve =
    gulp.parallel(
        cleanAndCopyAssetsAndBuild,
        watchFiles,
        startBrowsersync
    );


exports.default = serve;
exports.serve = serve;

exports.clean = clean;
exports.copyAssets = copyAssets;
exports.build = build;


