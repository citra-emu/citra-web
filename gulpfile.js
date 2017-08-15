const gulp = require('gulp');
const runSequence = require('run-sequence');
const exec = require('child_process').exec;
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const publishLocation = '/home/chris/www/';
const finalCommand = 'final:serve';

// Gulp Run Tasks

gulp.task('default', function(callback) {
  runSequence('hugo', finalCommand, callback);
});

gulp.task('all', function(callback) {
  runSequence(['scripts:downloads', 'scripts:games', 'scripts:twitter', 'scripts:wiki'],
              ['assets:js', 'assets:fonts', 'assets:css'],
              'hugo',
              finalCommand,
              callback);
});

gulp.task('downloads', function(callback) {
  runSequence('scripts:downloads', 'hugo', finalCommand, callback);
});

gulp.task('games', function(callback) {
  runSequence('scripts:games', 'hugo', finalCommand, callback);
});

gulp.task('twitter', function(callback) {
  runSequence('scripts:twitter', 'hugo', finalCommand, callback);
});

gulp.task('wiki', function(callback) {
  runSequence('scripts:wiki', 'hugo', finalCommand, callback);
});

gulp.task('assets', function(callback) {
  runSequence(['assets:js', 'assets:fonts', 'assets:css'], 'hugo', finalCommand, callback);
});

// Gulp Pipeline

gulp.task('setup', function() {
    process.env.HUGO_BASEURL = 'http://localhost:3000';
    process.env.HUGO_ENV = 'DEV';
});

gulp.task('scripts:downloads', ['setup'], function (callback) {
  exec(`cd ./scripts/downloads/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('scripts:games', ['setup'], function (callback) {
  exec(`cd ./scripts/games/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('scripts:twitter', ['setup'], function (callback) {
  exec(`cd ./scripts/twitter/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('scripts:wiki', ['setup'], function (callback) {
  exec(`cd ./scripts/wiki/ && npm install && node app.js`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('assets:js', function(){
  return gulp.src('assets/css/styles.less')
    .pipe(gulp.dest('build/js'))
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

gulp.task('hugo', ['setup'], function (cb) {
  exec('hugo -s ./site/ -d ../build/ -v', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('final:serve', ['setup'], function() {
    browserSync.init({
        open: false,
        server: {
            baseDir: 'build'
        }
    });

    gulp.watch('assets/js/**/*', ['assets:js']);
    gulp.watch('assets/css/**/*', ['assets:css']);
    gulp.watch('site/**/*.html', ['deploy-hugo']);

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('final:publish', ['setup'], function(){
  return gulp.src('build')
    .pipe(gulp.dest(publishLocation))
});
