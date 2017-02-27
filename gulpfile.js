var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var rimraf = require('rimraf');

var postcss = require('gulp-postcss');
var cssImport = require('postcss-import');
var cssnext = require('postcss-cssnext');

var md5 = require("gulp-md5-plus");

var ghPages = require('gulp-gh-pages');

var uncss = require('gulp-uncss');
var cleanCSS = require('gulp-clean-css');
var image = require('gulp-image');
var jimp = require("gulp-jimp-resize");

var htmlmin = require('gulp-htmlmin');

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
    .pipe(uncss({
      html: [`${distPath}/**/*.html`],
      ignore: [/\w\.in/,
              ".fade",
              ".collapse",
              ".collapsing",
              ".table",
              ".thumbnail",
              /(#|\.)navbar(\-[a-zA-Z]+)?/,
              /(#|\.)dropdown(\-[a-zA-Z]+)?/,
              /(#|\.)carousel(\-[a-zA-Z]+)?/,
            ]}))
    .pipe(cleanCSS())
    .pipe(md5(10, `${distPath}/**/*.html`))
    .pipe(gulp.dest('./'))
));

gulp.task('images', ['hugo'], () => (
  gulp.src(`${distPath}/images/*`, {base: './'})
      .pipe(image({
        mozjpeg: false,
        jpegoptim: false
      }))
      .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/images/jumbotron/*`, {base: './'})
      .pipe(jimp({ sizes: [{"width": 786, "height": 471 }] }))
      .pipe(image({
        mozjpeg: false,
        jpegoptim: false
      }))
      .pipe(gulp.dest('./')),
  gulp.src(`${distPath}/images/banners/*`, {base: './'})
      .pipe(jimp({ sizes: [{"width": 824, "height": 306 }] }))
      .pipe(image({
        mozjpeg: false,
        jpegoptim: false
      }))
      .pipe(gulp.dest('./'))
));

gulp.task('html', ['hugo', 'css', 'images'], () => (
  gulp.src(`${distPath}/**/*.html`, {base: './'})
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
));

gulp.task('deploy', ['hugo', 'css', 'images', 'html'], () => {
  require('fs').writeFileSync(`${distPath}/CNAME`, `${cname}`);
  require('fs').writeFileSync(`${distPath}/robots.txt`, `Sitemap: https://${cname}/sitemap.xml\n\nUser-agent: *`);
  return gulp.src(`${distPath}/**/*`).pipe(ghPages(deployOptions));
});
