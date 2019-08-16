# Citra Official Website

This repository contains the source for the [Citra Emulator](https://github.com/citra-emu/citra) website, which can be found at https://citra-emu.org/.

## Quick Start

### Required Dependencies
- [Node.js](https://nodejs.org): See the website for instructions for your OS.
- [Hugo](https://gohugo.io/): See the website for instructions for your OS, or install with NPM by running `npm install -g hugo-bin` with elevated privleges.
- [GraphicsMagick](http://www.graphicsmagick.org/): See the website for instructions for your OS.
- [ImageMagick](https://www.imagemagick.org): See the website for instructions for your OS.

### Optional Dependencies
- [gulp.js](http://gulpjs.com): See the website for instructions for your OS, or install with NPM by running `npm install -g gulp-cli` with elevated privleges. Recommended to be installed for convenience when building.

### Instructions
1. Open up a terminal or command prompt in the `citra-web` directory.
2. Run `npm install`.
3. Run `gulp all` if you installed Gulp to your system, otherwise run `./node_modules/gulp/bin/gulp.js all`.

Now, Gulp should have built the Citra website, its external content, and hosted it locally. 
It will print out the `Access URL`s, which you can go to in your browser to view it.

## Sitemap
The sitemap for the Citra website can be found in [SITEMAP.md](SITEMAP.md).
