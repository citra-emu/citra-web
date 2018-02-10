const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const util = require('util');
const logger = require('winston');

const sanitizeHtml = require('sanitize-html');

const request = require('request-promise');
const toml = require('toml');
const tomlify = require('tomlify-j0.4');
const blackfriday = require('./blackfriday.js');

const del = require('delete');
const exec = require('sync-exec');

const fsPathCode = './citra-games-wiki/games';
const fsPathWiki = './citra-games-wiki.wiki';
const fsPathHugoContent = '../../site/content/game';
const fsPathHugoBoxart = '../../site/static/images/game/boxart';
const fsPathHugoIcon = '../../site/static/images/game/icons';
const fsPathHugoScreenshots = '../../site/static/images/screenshots0';
const fsPathHugoSavefiles = '../../site/static/savefiles/';

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

async function getGithubIssues() {
  var results = [];

  // Only loop through the first x pages to prevent API limiting.
  for (var page = 0; page <= 15; page++) {
    let options = {
      url: `https://api.github.com/repos/citra-emu/citra/issues?per_page=99&page=${page}`,
      headers: { 'User-Agent': 'citrabot' }
    };

    logger.verbose(`Requesting Github Issue Page ${page}.`);
    var body = await request.get(options);
    var obj = JSON.parse(body);

    if (obj == null || obj.length == 0) {
      logger.verbose(`No more Github issues found -- on page ${page}.`);
      break;
    } else {
      results = results.concat(obj);
    }
  }

  return results;
}

async function getTestcases() {
  let options = {
    url: 'https://api.citra-emu.org/telemetry/testcase/',
    headers: { 'User-Agent': 'citrabot' },
  };

  var body = await request.get(options);
  return JSON.parse(body).map(x => {
    return {
      id: x.id,
      title: x.title,
      compatibility: x.compatibility.toString(),
      date: x.date,
      version: x.version,
      buildName: x.buildName,
      buildDate: x.buildDate,
      cpu: x.cpu,
      gpu: x.gpu,
      os: x.os,
      author: x.author
    }
  });
}

// Fetch game information stored in Github repository.
gitPull('./citra-games-wiki', 'https://github.com/citra-emu/citra-games-wiki.git');

// Fetch game articles stored in Github wiki.
gitPull('./citra-games-wiki.wiki', 'https://github.com/citra-emu/citra-games-wiki.wiki.git');

// Fetch all issues from Github.
var githubIssues = [];
var wikiEntries = {};
var testcases = [];

async function setup() {
  githubIssues = await getGithubIssues();
  logger.info(`Imported ${githubIssues.length} issues from Github.`);
  
  testcases = await getTestcases();
  logger.info(`Obtained ${testcases.length} testcases from Telemetry API.`);
};

setup().then(function() {
  // Make sure the output directories in Hugo exist.
  [fsPathHugoContent, fsPathHugoBoxart, fsPathHugoIcon, fsPathHugoSavefiles, fsPathHugoScreenshots].forEach(function (path) {
    if (fs.existsSync(path) == false) {
        logger.info(`Creating Hugo output directory: ${path}`);
        fs.mkdirSync(path);
    }
  });
})
.then(function() {
  // Transform wiki entries to lowercase
  const files = fs.readdirSync(fsPathWiki);

  logger.info(`Generating wiki database...`);
  files.forEach((file) => {
      wikiEntries[file.toLowerCase()] = file;
  });

  // Loop through each game and process it.
  getDirectories(fsPathCode).forEach(function(game) {
    processGame(game);
  });
})
.catch(function(err) {
  logger.error(err);
});

function processGame(game) {
  try {
    if (game == '.git' || game == '_validation') { return; }

    logger.info(`Processing game: ${game}`);

    // Copy the boxart for the game.
    fsextra.copySync(`${fsPathCode}/${game}/boxart.png`, `${fsPathHugoBoxart}/${game}.png`);

    // Copy the icon for the game.
    fsextra.copySync(`${fsPathCode}/${game}/icon.png`, `${fsPathHugoIcon}/${game}.png`);

    var model = toml.parse(fs.readFileSync(`${fsPathCode}/${game}/game.dat`, 'utf8'));
    let currentDate = new Date();
    model.date = `${currentDate.toISOString()}`;

    // Look up all testcases associated with the Title IDs.
    let releases = model.releases.map(y => y.title);
    let foundTestcases = testcases.filter(x => {
      return releases.includes(x.title);
    });
    
    // If no testcases exist in the toml file, create a blank array.
    if (!model.testcases) {
      model.testcases = [];
    }

    logger.info(`Found ${foundTestcases.length} testcases from telemetry, found ${model.testcases.length} in toml file.`);

    model.testcases = model.testcases.concat(foundTestcases);

    // Sort the testcases from most recent to least recent.
    model.testcases.sort(function(a, b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });

    // SHORTCUTS BLOCK
    // Parse testcase information out of the dat to reinject as shortcut values.
    if (model.testcases == null || model.testcases.length == 0) {
      model.compatibility = "99";
      model.testcase_date = "2000-01-01";
    } else {
      let recent = model.testcases[0];
      model.compatibility = recent.compatibility;
      model.testcase_date = recent.date;
    }

    const toTrim = ["the", "a", "an"];

    let trimmedTitle = model.title.toLowerCase();
    toTrim.forEach(trim => {
        if (trimmedTitle.startsWith(trim + " ")) {
            trimmedTitle = trimmedTitle.substr(trim.length + 1);
        }
    });

    let section_id = `${trimmedTitle[0]}`;
    if (!section_id.match(/[a-z]+/)) {
        section_id = "#";
    }

    model.section_id = section_id;
    // END SHORTCUTS BLOCK

    // SAVEFILE BLOCK
    var fsPathCodeSavefilesGame = `${fsPathCode}/${game}/savefiles/`;
    var fsPathHugoSavefilesGame = `${fsPathHugoSavefiles}/${game}/`;
    if (fs.existsSync(fsPathCodeSavefilesGame)) {
      // Create the savefile directory for the game.
      if (fs.existsSync(fsPathHugoSavefilesGame) == false) {
          fs.mkdirSync(fsPathHugoSavefilesGame);
      }

      // Copy all savefiles into the output folder, and read their data.
      model.savefiles = [];
      fs.readdirSync(fsPathCodeSavefilesGame).forEach(file => {
        if (path.extname(file) == '.zip') {
          fsextra.copySync(`${fsPathCodeSavefilesGame}/${file}`, `${fsPathHugoSavefilesGame}/${file}`);
        } else if (path.extname(file) == '.dat') {
          // Read the data file into an object.
          let savefile = toml.parse(fs.readFileSync(`${fsPathCodeSavefilesGame}/${file}`, 'utf8'));

          let stats = fs.statSync(`${fsPathCodeSavefilesGame}/${file}`);

          // Store the contents of the file in memory for adding it into the markdown later.
          model.savefiles.push({
            date: new Date(util.inspect(stats.mtime)),
            filename: file.replace('.dat', '.zip'),
            title: savefile.title,
            description: savefile.description,
            author: savefile.author,
            title_id: savefile.title_id
          });
        }
      });
      // Finished copying all savefiles into the output folder, and reading their data.
    }
    // END SAVEFILE BLOCK

    // GITHUB ISSUES BLOCK
    model.issues = [];
    model.closed_issues = [];

    if (model.github_issues != null && model.github_issues.length > 0) {
      model.github_issues.forEach(function(number) {
        let issue = githubIssues.find(x => x.number == number);
        if (issue == null) {
          model.closed_issues.push(number);
        } else {
          model.issues.push({
            number: issue.number.toString(),
            title: issue.title,
            state: issue.state,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            labels: issue.labels.map(function(x) { return { name: x.name, color: x.color } })
          });
        }
      });

      github_issues = null;
    }
    // END GITHUB ISSUES BLOCK

    // Copy the screenshots for the game.
    let fsPathScreenshotInputGame = `${fsPathCode}/${game}/screenshots/`;
    let fsPathScreenshotOutputGame = `${fsPathHugoScreenshots}/${game}/`;
    if (fs.existsSync(fsPathScreenshotInputGame)) {
      // Create the savefile directory for each game.
      if (fs.existsSync(fsPathScreenshotOutputGame) == false) {
          fs.mkdirSync(fsPathScreenshotOutputGame);
      }

      // Copy all screenshots into the output folder.
      fs.readdirSync(fsPathScreenshotInputGame).forEach(file => {
        if (path.extname(file) == '.png') {
          fsextra.copySync(`${fsPathScreenshotInputGame}/${file}`, `${fsPathScreenshotOutputGame}/${file}`);
        }
      });
    }

    // WIKI BLOCK
    var wikiText = "";
    let fsPathWikiGame = `${fsPathWiki}/${wikiEntries[game.toLowerCase() + ".md"]}`;
    if (fs.existsSync(fsPathWikiGame)) {
      wikiText = fs.readFileSync(fsPathWikiGame, 'utf8');

      // Fix Blackfriday markdown rendering differences.
      wikiText = blackfriday.fixLists(wikiText);
      wikiText = blackfriday.fixLinks(wikiText);
    } else {
      wikiText = "## No wiki exists yet for this game.";
    }
    // END WIKI BLOCK

    let modelText = tomlify(model, null, 2);

    let contentOutput = `+++\r\n${modelText}\r\n+++\r\n\r\n${wikiText}\r\n`;
    fs.writeFileSync(`${fsPathHugoContent}/${game}.md`, contentOutput);
  } catch (ex) {
    logger.warn(`${game} failed to generate: ${ex}`);
    logger.error(ex);
  }
}
