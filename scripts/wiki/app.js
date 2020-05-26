var fs = require('fs');
var util = require('util');
var winston = require('winston');

var sanitizeHtml = require('sanitize-html');

var del = require('delete');
var exec = require('sync-exec');

var inputDirectory = './citra.wiki/';
var outputDirectory = '../../site/content/wiki/';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

// The URL
function url(title) {
  return '/wiki/' + title.replace(/\s+/g, '-').toLowerCase();
}

if (fs.existsSync(inputDirectory)) {
    logger.info(`Purging input directory: ${inputDirectory}`);
    del.sync(inputDirectory, {force: true});
}

logger.info('Cloning citra.wiki repository');
exec('git clone https://github.com/citra-emu/citra.wiki.git');

if (fs.existsSync(outputDirectory) == false) {
    logger.info(`Creating missing output directory: ${outputDirectory}`);
    fs.mkdirSync(outputDirectory);
}

fs.readdir(inputDirectory, function(err, items) {
    try {
      // Look for all .md files within the wiki directory.
      items.filter(file => file.substr(-3) === '.md').forEach(function(item) {
        // Generate the title from the filename.
        let title = item.replace(/-/g, ' ').slice(0, -3);
        var stats = fs.statSync(`${inputDirectory}${item}`);
        var modified = new Date(util.inspect(stats.mtime));

        // Read the .md file.
        fs.readFile(`${inputDirectory}${item}`, 'utf8', function (err,data) {
          if (err) { logger.error(err); return; }

          try {
            // Convert various data inside of the markdown language.
            let cleanData = sanitizeHtml(data);

            // Blackfriday Markdown Rendering requires a blank line before lists.
            try {
              var lines = cleanData.split(/\r?\n/);
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
            cleanData = cleanData.replace(/\[\[(.*)\|(.*)\]\]/g, function(match, p1, p2) {
              return `[${p1}](${url(p2)})`
            });

            // Replacing tags like [[Common Issues]]
            cleanData = cleanData.replace(/\[\[(.*)\]\]/g, function(match, p1) {
              return `[${p1}](${url(p1)})`
            });

            // Create the new markdown header for Hugo.
            let newFileContents = `+++\r\ntitle = "${title}"\r\ndate = "${modified.toISOString()}"\r\n+++\r\n\r\n${cleanData}\r\n`;

            let itemOutput = item.toLowerCase();
            fs.writeFile(`${outputDirectory}${itemOutput}`, newFileContents, function(err) {
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
