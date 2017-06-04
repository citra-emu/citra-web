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
const outputDirectoryIcons = '../../site/static/images/game/icons';
const outputDirectoryScreenshots = '../../site/static/images/screenshots0';
const outputDirectorySavefiles = '../../site/static/savefiles/';

// The URL
function url(title) {
  return '/wiki/' + title.replace(/\s+/g, '-').toLowerCase();
}

function gitPull(directory, repository) {
  if (fs.existsSync(directory)) {
      logger.info(`Fetching latest from Github : ${directory}`);
      logger.info(`git --git-dir=${directory} pull`);
      exec(`git --git-dir=${directory} pull`);
  } else {
      logger.info(`Cloning repository from Github : ${directory}`);
      logger.info(`git clone ${repository}`);
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

if (fs.existsSync(outputDirectoryIcons) == false) {
    logger.info(`Creating missing output directory: ${outputDirectoryIcons}`);
    fs.mkdirSync(outputDirectoryIcons);
}

if (fs.existsSync(outputDirectorySavefiles) == false) {
    logger.info(`Creating missing output directory: ${outputDirectorySavefiles}`);
    fs.mkdirSync(outputDirectorySavefiles);
}

if (fs.existsSync(outputDirectoryScreenshots) == false) {
    logger.info(`Creating missing output directory: ${outputDirectoryScreenshots}`);
    fs.mkdirSync(outputDirectoryScreenshots);
}

try {
  // Loop through each game folder.
  getDirectories(inputDirectoryGame).forEach(function(game) {
    if (game == '.git') { return; }

    logger.info(`Creating Hugo files for ${game}`);

    // Copy the boxart for the game.
    let boxartPath = `${inputDirectoryGame}/${game}/boxart.png`;
    if (fs.existsSync(boxartPath)) {
      fsextra.copySync(boxartPath, `${outputDirectoryBoxart}/${game}.png`);
    }

    // Copy the icon for the game.
    let iconPath = `${inputDirectoryGame}/${game}/icon.png`;
    if (fs.existsSync(iconPath)) {
      fsextra.copySync(iconPath, `${outputDirectoryIcons}/${game}.png`);
    }

    // Copy the savefiles for the game.
    let inputDirectorySavefilesGame = `${inputDirectoryGame}/${game}/savefiles/`;
    let outputDirectorySavefilesGame = `${outputDirectorySavefiles}/${game}/`;
    let savefileMetadataContents = [];

    if (fs.existsSync(inputDirectorySavefilesGame)) {
      // Create the savefile directory for each game.
      if (fs.existsSync(outputDirectorySavefilesGame) == false) {
          fs.mkdirSync(outputDirectorySavefilesGame);
      }

      // Copy all savefiles into the output folder and store their contents.
      fs.readdirSync(inputDirectorySavefilesGame).forEach(file => {
        if (file.slice(-5) == '.zip') {
          fsextra.copySync(`${inputDirectorySavefilesGame}/${file}`, `${outputDirectorySavefilesGame}/${file.replace('.zip', '.csav')}`);
        } else if (file.slice(-4) == '.dat') {
          // Store the contents of the file in memory for adding it into the markdown later.
          savefileMetadataContents.push({ filename: file.replace('.dat', '.csav'), contents: fs.readFileSync(`${inputDirectorySavefilesGame}/${file}`, 'utf8') });
        }
      });
    }

    // Copy the screenshots for the game.
    let inputDirectoryScreenshotsGame = `${inputDirectoryGame}/${game}/screenshots/`;
    let outputDirectoryScreenshotsGame = `${outputDirectoryScreenshots}/${game}/`;

    if (fs.existsSync(inputDirectoryScreenshotsGame)) {
      // Create the savefile directory for each game.
      if (fs.existsSync(outputDirectoryScreenshotsGame) == false) {
          fs.mkdirSync(outputDirectoryScreenshotsGame);
      }

      // Copy all screenshots into the output folder.
      fs.readdirSync(inputDirectoryScreenshotsGame).forEach(file => {
        if (file.slice(-4) == '.png') {
          fsextra.copySync(`${inputDirectoryScreenshotsGame}/${file}`, `${outputDirectoryScreenshotsGame}/${file}`);
        }
      });
    }


    // Create the markdown file to be displayed in Hugo.
    let title = game.replace(/-/g, ' ').slice(0, -3);
    var stats = fs.statSync(`${inputDirectoryGame}/${game}/game.dat`);
    let modified = new Date(util.inspect(stats.mtime));

    let datContents = fs.readFileSync(`${inputDirectoryGame}/${game}/game.dat`, 'utf8');
    let wikiContents = fs.readFileSync(`${inputDirectoryWiki}/${game}.md`, 'utf8');

    // Fix Blackfriday markdown rendering differences.
    wikiContents = blackfriday.fixLists(wikiContents);
    wikiContents = blackfriday.fixLinks(wikiContents);

    // Read all savefiles from array and copy them into the markdown.
    savefileMetadataContents.forEach(function(savefile) {
      let modified = new Date(util.inspect(stats.mtime));
      datContents += `\r\n\r\n[[ savefiles ]]\r\n${savefile.contents}\r\nfilename = "${savefile.filename}"\r\ndate = "${modified.toISOString()}"\r\n`;
    });

    let output = `+++\r\ndate = "${modified.toISOString()}"\r\n${datContents}\r\n+++\r\n\r\n${wikiContents}\r\n`;
    fs.writeFileSync(`${outputDirectoryMd}/${game}.md`, output);
  });
} catch (ex) {
  logger.error(ex);
}
