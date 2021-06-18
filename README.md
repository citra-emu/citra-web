# Citra Official Website

This repository contains the source for the [Citra Emulator](https://github.com/citra-emu/citra) website, which can be found at https://citra-emu.org/.

## Quick Start

### Required Dependencies
- [Node.js](https://nodejs.org) `sudo apt-get install nodejs nodejs-legacy`
- [Gulp.js](http://gulpjs.com) `sudo npm install -g gulp`
- [Hugo](https://gohugo.io/) `sudo npm install -g hugo-bin`
- [GraphicsMagick](http://www.graphicsmagick.org/) `sudo apt-get install graphicsmagick`
- [ImageMagick](https://www.imagemagick.org) (Should be installed through `graphicsmagick`)

### Instructions
1. Open up a terminal or command prompt in the `citra-web` directory.
2. Run `npm install`.
3. Run `gulp all`.

Now, Gulp should have built the Citra website, its external content, and hosted it locally. 
It will print out the `Access URL`s, which you can go to in your browser to view it.

## Sitemap
The sitemap for the Citra website can be found in [SITEMAP.md](SITEMAP.md)
