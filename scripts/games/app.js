var fs = require('fs');
var fsextra = require('fs-extra');
var util = require('util');
var logger = require('winston');

var sanitizeHtml = require('sanitize-html');

var del = require('delete');
var exec = require('sync-exec');

var inputDirectoryGame = './citra-games-wiki/';
var inputDirectoryWiki = './citra-games-wiki.wiki/';
var outputDirectoryMd = '../../site/content/games/';
var outputDirectoryBoxart = '../../site/static/images/games/'

// The URL
function url(title) {
  return '/wiki/' + title.replace(/\s+/g, '-').toLowerCase();
}

if (fs.existsSync(inputDirectoryGame)) {
    logger.info(`Purging input directory game: ${inputDirectoryGame}`);
    del.sync(inputDirectoryGame, {force: true});
}

if (fs.existsSync(inputDirectoryWiki)) {
    logger.info(`Purging input directory wiki: ${inputDirectoryWiki}`);
    del.sync(inputDirectoryWiki, {force: true});
}

exec('git clone https://github.com/citra-emu/citra-games-wiki.git');
exec('git clone https://github.com/citra-emu/citra-games-wiki.wiki.git');

if (fs.existsSync(outputDirectoryMd) == false) {
    logger.info(`Creating missing output directory: ${outputDirectoryMd}`);
    fs.mkdirSync(outputDirectoryMd);
}

if (fs.existsSync(outputDirectoryBoxart) == false) {
    logger.info(`Creating missing output directory: ${outputDirectoryBoxart}`);
    fs.mkdirSync(outputDirectoryBoxart);
}

fs.readdir(inputDirectoryGame, function(err, items) {
    try {
      // Look for all .md files within the wiki directory.
      items.filter(file => file.substr(-4) === '.png').forEach(function(item) {
        logger.info(`Copying boxart PNG ${item}`);
        fsextra.copySync(`${inputDirectoryGame}${item}`, `${outputDirectoryBoxart}${item}`);
      });
      items.filter(file => file.substr(-4) === '.dat').forEach(function(item) {
        // Generate the title from the filename.
        let title = item.replace(/-/g, ' ').slice(0, -3);
        var stats = fs.statSync(`${inputDirectoryGame}${item}`);
        var modified = new Date(util.inspect(stats.mtime));

        // Read the .dat file and the .md file and fuse them.
        fs.readFile(`${inputDirectoryGame}${item}`, 'utf8', function (err,data) {
          if (err) { logger.error(err); return; }

          try {
            // Convert various data inside of the markdown language.
            let cleanGameData = data;
            let cleanWikiData = fs.readFileSync(`${inputDirectoryWiki}${item.replace('.dat', '.md')}`, 'utf8');

            // Blackfriday Markdown Rendering requires a blank line before lists.
            try {
              var lines = cleanWikiData.split(/\r?\n/);
              for(var i = 0; i < lines.length; i++) {
                  // If it's the start of the file, ignore to prevent an index issue.
                  if (i > lines.length) { return; }
                  if (i == 0 || lines[i] == '\n') { continue; }

                  // Search for the start of a list designated by the * character.
                  if (lines[i].startsWith("* ") && lines[i - 1].startsWith("* ") == false) {
                    i = i + 1;
                    lines.splice(i - 1, 0, '');
                  }
              }
              cleanData = lines.join('\n');
            } catch (ex) {
              logger.error(ex);
            }

            // Replacing tags like [[Common Issues on Windows|Common Issues]]
            cleanWikiData = cleanWikiData.replace(/\[\[(.*)\|(.*)\]\]/g, function(match, p1, p2) {
              return `[${p1}](${url(p2)})`
            });

            // Replacing tags like [[Common Issues]]
            cleanWikiData = cleanWikiData.replace(/\[\[(.*)\]\]/g, function(match, p1) {
              return `[${p1}](${url(p1)})`
            });

            // Create the new markdown header for Hugo.
            let newFileContents = `+++\r\ndate = "${modified.toISOString()}"\r\n${cleanGameData}+++\r\n\r\n${cleanWikiData}\r\n`;

            let itemOutput = item.toLowerCase().replace('.dat', '.md');
            fs.writeFile(`${outputDirectoryMd}${itemOutput}`, newFileContents, function(err) {
                if (err) return logger.error(err);
                logger.info(`Wrote file ${itemOutput} to filesystem.`);
            });
          } catch (ex) {
            logger.error(ex);
          }
        });
      });
    } catch (ex) {
      logger.error(ex);
    }
});
