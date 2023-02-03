/* eslint-disable no-console */
const gulp = require('gulp');
const fs = require('fs');
const exec = require('child_process').exec;
const log = require('fancy-log');
const parseArgs = require('minimist');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const parallel = require('concurrent-transform');
const imageResize = require('gulp-image-resize');
const path = require('path');

function findSassBinary() {
    const modulePath = require.resolve(
        `sass-embedded-${process.platform}-${process.arch}/` +
          'dart-sass-embedded/dart-sass-embedded' +
          (process.platform === 'win32' ? '.bat' : '')
    );
    return path.dirname(modulePath);
}

gulp.task('scripts:games', function (callback) {
    exec('yarn run compatdb', { cwd: './scripts/shared-hugo-scripts/' }, function (err, stdout, stderr) {
        callback(err);
    });
});

gulp.task('scripts:wiki', function (callback) {
    exec('yarn run wiki', { cwd: './scripts/shared-hugo-scripts/' }, function (err, stdout, stderr) {
        callback(err);
    });
});

gulp.task('assets:images', function() {
    const baseImages = gulp.src('build/images/*', {base: './'})
        .pipe(gulp.dest('./'));
    const jumbotronImages = gulp.src('build/images/jumbotron/*', {base: './'})
        .pipe(imageResize({ width: 786, height: 471, crop: true }))
        .pipe(gulp.dest('./'));
    const bannerImages = gulp.src('build/images/banners/*', {base: './'})
        .pipe(imageResize({ width: 824, height: 306, crop: false }))
        .pipe(gulp.dest('./'));
    const boxartImages = gulp.src('build/images/game/boxart/*', {base: './'})
        .pipe(imageResize({ width: 328, height: 300, crop: true }))
        .pipe(gulp.dest('./'));
    const iconImages = gulp.src('build/images/game/icons/*', {base: './'})
        .pipe(imageResize({ width: 48, height: 48, crop: true }))
        .pipe(gulp.dest('./'));
    const screenshotImages = gulp.src('build/images/screenshots/*')
        .pipe(imageResize({ width: 400, height: 240, crop: false }))
        .pipe(gulp.dest('build/images/screenshots/thumbs'));

    return parallel(baseImages, jumbotronImages, bannerImages, boxartImages, iconImages, screenshotImages);
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

gulp.task('hugo', (callback) => {
    const sassPath = findSassBinary();
    process.env.PATH = `${process.env.PATH}:${sassPath}`;
    import('hugo-bin').then((hugo) => {
        exec(hugo.default + ' -s ./site/ -d ../build/ -v --gc', (err, stdout, stderr) => {
            console.log(stdout);
            callback(err);
        });
    }).catch(err => callback(err));
});

gulp.task('final:serve', function(done) {
    browserSync.init({
        open: false,
        server: {
            baseDir: 'build'
        }
    });

    gulp.watch('src/js/**/*', gulp.series('assets:js'));
    gulp.watch('src/scss/**/*', gulp.series('hugo'));
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
let ephemeralURL = null;

if (parseArgs(process.argv).production) {
    process.env.NODE_ENV = 'production';
    process.env.HUGO_ENV = 'PRD';
    process.env.HUGO_BASEURL = `https://${cname}`;
    finalCommand = 'final:publish';
} else if ((ephemeralURL = parseArgs(process.argv).ephemeral)) {
    process.env.NODE_ENV = 'production';
    process.env.HUGO_ENV = 'PRD';
    process.env.HUGO_BASEURL = ephemeralURL;
    finalCommand = 'final:publish';
} else {
    process.env.HUGO_ENV = 'DEV';
    process.env.HUGO_BASEURL = 'http://localhost:3000';
    finalCommand = 'final:serve';
}

log.info(`process.env.HUGO_ENV = '${process.env.HUGO_ENV}'`);
log.info(`process.env.HUGO_BASEURL = '${process.env.HUGO_BASEURL}'`);

gulp.task('default', gulp.series(gulp.parallel('assets:js', 'assets:fonts'), 'hugo', 'assets:images', finalCommand));
gulp.task('all', gulp.series(gulp.parallel('scripts:games', 'scripts:wiki'), gulp.parallel('assets:js', 'assets:fonts'), 'hugo', 'assets:images', finalCommand));
gulp.task('content', gulp.series('hugo', finalCommand));
