const gulp = require('gulp');
const util = require('gulp-util');
const merge = require('merge-stream');
const runSequence = require('run-sequence');
const exec = require('child_process').exec;
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const imageResize = require('gulp-image-resize');

const publishLocation = '/home/chris/www/';
var finalCommand = null;

// Gulp Run Tasks
gulp.task('default', ['start:setup'], function(callback) {
  runSequence('hugo', finalCommand, callback);
});

gulp.task('all', ['start:setup'], function(callback) {
  runSequence(['scripts:downloads', 'scripts:games', 'scripts:twitter', 'scripts:wiki'],
              ['assets:fonts', 'assets:css'],
              'hugo',
              'assets:images',
              finalCommand,
              callback);
});

gulp.task('downloads', ['start:setup'], function(callback) {
  runSequence('scripts:downloads', 'hugo', finalCommand, callback);
});

gulp.task('games', ['start:setup'], function(callback) {
  runSequence('scripts:games', 'hugo', finalCommand, callback);
});

gulp.task('twitter', ['start:setup'], function(callback) {
  runSequence('scripts:twitter', 'hugo', finalCommand, callback);
});

gulp.task('wiki', ['start:setup'], function(callback) {
  runSequence('scripts:wiki', 'hugo', finalCommand, callback);
});

gulp.task('assets', ['start:setup'], function(callback) {
  runSequence(['assets:fonts', 'assets:css'], 'hugo', 'assets:images', finalCommand, callback);
});

// Gulp Pipeline
gulp.task('start:setup', function() {
    if (util.env.production) {
      process.env.HUGO_ENV = 'PRD';
      process.env.HUGO_BASEURL = 'https://citra-emu.org';
      finalCommand = 'final:publish';
    } else {
      process.env.HUGO_ENV = 'DEV';
      process.env.HUGO_BASEURL = 'http://localhost:3000';
      finalCommand = 'final:serve';
    }

    util.log(`process.env.HUGO_ENV = '${process.env.HUGO_ENV}'`);
    util.log(`process.env.HUGO_BASEURL = '${process.env.HUGO_BASEURL}'`);
});

gulp.task('scripts:downloads', function (callback) {
  exec(`cd ./scripts/downloads/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('scripts:games', function (callback) {
  exec(`cd ./scripts/games/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('scripts:twitter', function (callback) {
  exec(`cd ./scripts/twitter/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('scripts:wiki', function (callback) {
  exec(`cd ./scripts/wiki/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('assets:images', ['hugo'], function() {
  var baseImages = gulp.src(`build/images/*`, {base: './'})
      .pipe(gulp.dest('./'));
  var jumbotronImages = gulp.src(`build/images/jumbotron/*`, {base: './'})
      .pipe(imageResize({ width: 786, height: 471, crop: true }))
      .pipe(gulp.dest('./'));
  var bannerImages = gulp.src(`build/images/banners/*`, {base: './'})
      .pipe(imageResize({ width: 824, height: 306, crop: false }))
      .pipe(gulp.dest('./'));
  var boxartImages = gulp.src(`build/images/game/boxart/*`, {base: './'})
      .pipe(imageResize({ width: 328, height: 300, crop: true }))
      .pipe(gulp.dest('./'));
  var iconImages = gulp.src(`build/images/game/icons/*`, {base: './'})
      .pipe(imageResize({ width: 48, height: 48, crop: true }))
      .pipe(gulp.dest('./'));
  var screenshotImages = gulp.src(`build/images/screenshots/*`)
      .pipe(imageResize({ width: 400, height: 240, crop: false }))
      .pipe(gulp.dest(`build/images/screenshots/thumbs`));
  return merge(baseImages, jumbotronImages, bannerImages, boxartImages, iconImages, screenshotImages);
});

gulp.task('assets:fonts', function(){
  return gulp.src('./node_modules/bootstrap-sass/assets/fonts/*/**')
    .pipe(gulp.dest('build/fonts/'))
});

gulp.task('assets:css', function () {
  return gulp.src('assets/css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
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

function FileChange(x) {
  console.log(`[FileChange] File changed: ${x.path}`);
  browserSync.reload(x);
}

gulp.task('final:serve', function() {
    browserSync.init({
        open: false,
        server: {
            baseDir: 'build'
        }
    });

    gulp.watch('assets/js/**/*', ['assets:js']);
    gulp.watch('assets/css/**/*', ['assets:css']);
    gulp.watch('site/**/*.html', ['deploy-hugo']);

    gulp.watch('build/**/*').on('change', FileChange);
});

gulp.task('final:publish', function(){
  // Because hugo generates all files again regardless of if they've changed
  // or not, we need to compare the dist directory's sha1 hash
  // to see if we really need to copy the file.

  // This allows nginx / etags to work the way they were intended.
  return gulp.src('build/**/*')
    .pipe(gulp.dest(publishLocation))
});
