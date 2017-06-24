const gulp = require('gulp');
const util = require('gulp-util');
const exec = require('child_process').exec;
const rimraf = require('rimraf');

const browsersync = require('browser-sync');
const ghPages = require('gulp-gh-pages');

const md5 = require("gulp-md5-plus");
const postcss = require('gulp-postcss');
const cssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");

const imageResize = require('gulp-image-resize');

const htmlmin = require('gulp-htmlmin');

const distPath = './site/public';
const cname = 'citra-emu.org';
const deployOptions = {
  remoteUrl: "git@github.com:CitraBotWeb/CitraBotWeb.github.io.git",
  branch: "master"
};

gulp.task("default", ['serve']);

// PHASE 1 - Setup
gulp.task('setup', function(cb) {
  if (util.env.production) {
    process.env.HUGO_ENV = 'PRD';
  } else {
    process.env.HUGO_ENV = 'DEV';
  }
  process.env.GULP = 'true';

  util.log(`process.env.HUGO_ENV = '${process.env.HUGO_ENV}'`);
  util.log(`process.env.GULP = '${process.env.GULP}'`);

  rimraf(`${distPath}`, cb);
});

// PHASE 2 - Data Dependencies

// PHASE 3 - Building
gulp.task('hugo', ['setup'], function (cb) {
  exec('hugo -s ./site/ -v', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task("css", ['hugo'], () => (
  gulp.src(`${distPath}/css/**/*.css`, {base: './'})
    .pipe(postcss([cssnext(), cssImport({from: `${distPath}/css/main.css`})]))
    .pipe(gulp.dest('./'))
));

gulp.task('images', ['hugo'], () => (
  gulp.src(`${distPath}/images/*`, {base: './'})
      .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/images/jumbotron/*`, {base: './'})
      .pipe(imageResize({ width: 786, height: 471, crop: true }))
      .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/images/banners/*`, {base: './'})
      .pipe(imageResize({ width: 824, height: 306, crop: false }))
      .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/images/game/boxart/*`, {base: './'})
      .pipe(imageResize({ width: 328, height: 300, crop: true }))
      .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/images/game/icons/*`, {base: './'})
      .pipe(imageResize({ width: 48, height: 48, crop: true }))
      .pipe(gulp.dest('./')),

  gulp.src(`${distPath}/images/screenshots/*`)
      .pipe(imageResize({ width: 400, height: 240, crop: false }))
      .pipe(gulp.dest(`${distPath}/images/screenshots/thumbs`))
));

// This task ensures all phases up to PHASE 3 are completed.
gulp.task('build', ['hugo', 'css', 'images']);

// STAGE 4 - Optimization
gulp.task('compress', ['build'], () => (
  gulp.src(`${distPath}/js/**/*.js`, {base: './'})
    .pipe(md5(10, `${distPath}/**/*.html`))
    .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/**/*.html`, {base: './'})
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/css/**/*.css`, {base: './'})
    .pipe(cleanCSS())
    .pipe(md5(10, `${distPath}/**/*.html`))
    .pipe(gulp.dest('./'))
));

// STAGE 5 - Deploy

// Used for Development
gulp.task('serve', ['build'], () => {
  // Serve files from the root of this project
  browsersync({
      server: {
          baseDir: distPath
      },
      open: false
  });
});

// Used for Production
gulp.task('deploy', ['build', 'compress'], () => {
  require('fs').writeFileSync(`${distPath}/CNAME`, `${cname}`);
  require('fs').writeFileSync(`${distPath}/robots.txt`, `Sitemap: https://${cname}/sitemap.xml\n\nUser-agent: *`);
  return gulp.src(`${distPath}/**/*`).pipe(ghPages(deployOptions));
});
