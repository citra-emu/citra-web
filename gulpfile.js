const gulp = require('gulp');
const exec = require('child_process').exec;
const rimraf = require('rimraf');

const ghPages = require('gulp-gh-pages');

const md5 = require("gulp-md5-plus");
const postcss = require('gulp-postcss');
const cssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cleanCSS = require('gulp-clean-css');

const imageResize = require('gulp-image-resize');

const htmlmin = require('gulp-htmlmin');

const distPath = './site/public';
const cname = 'citra-emu.org';
const deployOptions = {
  remoteUrl: "git@github.com:CitraBotWeb/CitraBotWeb.github.io.git",
  branch: "master"
};

gulp.task("default", ['html']);

gulp.task('setup', function(cb) {
    process.env.HUGO_ENV = 'PRD';
    process.env.GULP = 'true';
    rimraf(`${distPath}`, cb);
});

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
    .pipe(cleanCSS())
    .pipe(md5(10, `${distPath}/**/*.html`))
    .pipe(gulp.dest('./'))
));

gulp.task("js", ['hugo'], () => (
  gulp.src(`${distPath}/js/**/*.js`, {base: './'})
    .pipe(md5(10, `${distPath}/**/*.html`))
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
      .pipe(gulp.dest('./'))
));

gulp.task('html', ['hugo', 'css', 'js', 'images'], () => (
  gulp.src(`${distPath}/**/*.html`, {base: './'})
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
));

gulp.task('deploy', ['html'], () => {
  require('fs').writeFileSync(`${distPath}/CNAME`, `${cname}`);
  require('fs').writeFileSync(`${distPath}/robots.txt`, `Sitemap: https://${cname}/sitemap.xml\n\nUser-agent: *`);
  return gulp.src(`${distPath}/**/*`).pipe(ghPages(deployOptions));
});
