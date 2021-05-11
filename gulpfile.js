/* eslint-disable no-console */
const gulp = require('gulp');
const fs = require('fs');
const merge = require('merge-stream');
const exec = require('child_process').exec;
const log = require('fancy-log');
const parseArgs = require('minimist');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const imageResize = require('gulp-image-resize');

gulp.task('scripts:games', function (callback) {
    exec('yarn install && node app.js', { cwd: './scripts/compatdb/' }, function (err, stdout, stderr) {
        callback(err);
    });
});

gulp.task('scripts:wiki', function (callback) {
    exec('yarn install && node app.js', { cwd: './scripts/wiki/' }, function (err, stdout, stderr) {
        callback(err);
    });
});

gulp.task('assets:images', function() {
    var baseImages = gulp.src('build/images/*', {base: './'})
        .pipe(gulp.dest('./'));
    var jumbotronImages = gulp.src('build/images/jumbotron/*', {base: './'})
        .pipe(imageResize({ width: 786, height: 471, crop: true }))
        .pipe(gulp.dest('./'));
    var bannerImages = gulp.src('build/images/banners/*', {base: './'})
        .pipe(imageResize({ width: 824, height: 306, crop: false }))
        .pipe(gulp.dest('./'));
    var boxartImages = gulp.src('build/images/game/boxart/*', {base: './'})
        .pipe(imageResize({ width: 328, height: 300, crop: true }))
        .pipe(gulp.dest('./'));
    var iconImages = gulp.src('build/images/game/icons/*', {base: './'})
        .pipe(imageResize({ width: 48, height: 48, crop: true }))
        .pipe(gulp.dest('./'));
    var screenshotImages = gulp.src('build/images/screenshots/*')
        .pipe(imageResize({ width: 400, height: 240, crop: false }))
        .pipe(gulp.dest('build/images/screenshots/thumbs'));
  
    return merge(baseImages, jumbotronImages, bannerImages, boxartImages, iconImages, screenshotImages);
});

gulp.task('assets:js', function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('assets:fonts', function(){
    return gulp.src('./node_modules/bootstrap-sass/assets/fonts/**/*')
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('assets:scss', function () {
    var postCssOptions = [ cssnano ];
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postCssOptions))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

gulp.task('hugo', function (cb) {
    exec('hugo -s ./site/ -d ../build/ -v', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('final:serve', function(done) {
    browserSync.init({
        open: false,
        server: {
            baseDir: 'build'
        }
    });

    gulp.watch('src/js/**/*', gulp.series('assets:js'));
    gulp.watch('src/scss/**/*', gulp.series('assets:scss'));
    gulp.watch('site/**/*.html', gulp.series('hugo'));
    gulp.watch('site/**/*.md', gulp.series('hugo'));

    gulp.watch('build/**/*').on('change', function(x) {
        browserSync.reload(x);
    });

    done();
});

gulp.task('final:publish', function(done) {
    fs.writeFileSync('build/CNAME', `${cname}`);
    fs.writeFileSync('build/robots.txt', `Sitemap: https://${cname}/sitemap.xml\n\nUser-agent: *`);
    done();
});

const cname = 'citra-emu.org';
var finalCommand = null;

if (parseArgs(process.argv).production) {
    process.env.NODE_ENV = 'production';
    process.env.HUGO_ENV = 'PRD';
    process.env.HUGO_BASEURL = `https://${cname}`;
    finalCommand = 'final:publish';
} else {
    process.env.HUGO_ENV = 'DEV';
    process.env.HUGO_BASEURL = 'http://localhost:3000';
    finalCommand = 'final:serve';
}

log.info(`process.env.HUGO_ENV = '${process.env.HUGO_ENV}'`);
log.info(`process.env.HUGO_BASEURL = '${process.env.HUGO_BASEURL}'`);

gulp.task('default', gulp.series(gulp.parallel('assets:js', 'assets:fonts', 'assets:scss'), 'hugo', 'assets:images', finalCommand));
gulp.task('all', gulp.series(gulp.parallel('scripts:games', 'scripts:wiki'), gulp.parallel('assets:js', 'assets:fonts', 'assets:scss'), 'hugo', 'assets:images', finalCommand));
gulp.task('content', gulp.series('hugo', finalCommand));
