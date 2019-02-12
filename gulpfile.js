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


// Watch files
function watchFiles() {
    gulp.watch("./dist/**/*", reloadBrowserSync);
    gulp.watch("./src/**/*", cleanCopyAssetsAndBuild);
    gulp.watch("./index.html", reloadBrowserSync);
}

// Clean dist folder
function clean(done) {
    console.info('Cleaning...');
    return del(["./dist/**/*"]);
    done();
}

// copy assets:
function copyAssets(done) {
    console.info('copy assets...');
    return gulp
        .src(['src/assets/**/*'], {base: 'src/assets'})
        .pipe(gulp.dest('dist/assets'));
    done();
}

// build: concatinate for each html  header & content & footer:
function build(done) {
    console.info('build...');
    gulp
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
    done();
}

const cleanCopyAssetsAndBuild = gulp.series(clean, copyAssets, build);
const serve = gulp.parallel(cleanCopyAssetsAndBuild, watchFiles, startBrowsersync);


exports.default = build;
exports.clean = clean;
exports.copyAssets = copyAssets;
exports.build = build;
exports.cleanCopyAssetsAndBuild = cleanCopyAssetsAndBuild;

exports.serve = serve;
exports.watchFiles = watchFiles;
