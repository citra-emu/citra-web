const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const util = require('util');
const logger = require('winston');

const sanitizeHtml = require('sanitize-html');

const blackfriday = require('./blackfriday.js');

const del = require('delete');
const exec = require('sync-exec');

const inputDirectoryGame = './citra-games-wiki';
const inputDirectoryWiki = './citra-games-wiki.wiki';
const outputDirectoryMd = '../../site/content/game';
const outputDirectoryBoxart = '../../site/static/images/game/boxart';

// The URL
function url(title) {
  return '/wiki/' + title.replace(/\s+/g, '-').toLowerCase();
}

function gitPull(directory, repository) {
  if (fs.existsSync(directory)) {
      logger.info(`Fetching latest from Github : ${directory}`);
      exec(`git --git-dir=${directory} pull`);
  } else {
      logger.info(`Cloning repository from Github : ${directory}`);
      exec(`git clone ${repository}`);
  }
}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

// Fetch game information stored in Github repository.
gitPull(inputDirectoryGame, 'https://github.com/citra-emu/citra-games-wiki.git');

// Fetch game articles stored in Github wiki.
gitPull(inputDirectoryWiki, 'https://github.com/citra-emu/citra-games-wiki.wiki.git');

// Make sure the output directories in Hugo exist.
if (fs.existsSync(outputDirectoryMd) == false) {
    logger.info(`Creating missing output directory: ${outputDirectoryMd}`);
    fs.mkdirSync(outputDirectoryMd);
}

if (fs.existsSync(outputDirectoryBoxart) == false) {
    logger.info(`Creating missing output directory: ${outputDirectoryBoxart}`);
    fs.mkdirSync(outputDirectoryBoxart);
}

try {
  // Loop through each game folder.
  getDirectories(inputDirectoryGame).forEach(function(game) {
    if (game == '.git') { return; }

    logger.info(`Creating Hugo files for ${game}`);

    // Copy the boxart for the game.
    fsextra.copySync(`${inputDirectoryGame}/${game}/boxart.png`, `${outputDirectoryBoxart}/${game}.png`);

    // Create the markdown file to be displayed in Hugo.
    let title = game.replace(/-/g, ' ').slice(0, -3);
    var stats = fs.statSync(`${inputDirectoryGame}/${game}/game.dat`);
    var modified = new Date(util.inspect(stats.mtime));

    let datContents = fs.readFileSync(`${inputDirectoryGame}/${game}/game.dat`, 'utf8');
    let wikiContents = fs.readFileSync(`${inputDirectoryWiki}/${game}.md`, 'utf8');

    // Fix Blackfriday markdown rendering differences.
    wikiContents = blackfriday.fixLists(wikiContents);
    wikiContents = blackfriday.fixLinks(wikiContents);

    let output = `+++\r\ndate = "${modified.toISOString()}"\r\n${datContents}+++\r\n\r\n${wikiContents}\r\n`;
    fs.writeFileSync(`${outputDirectoryMd}/${game}.md`, output);
  });
} catch (ex) {
  logger.error(ex);
}
