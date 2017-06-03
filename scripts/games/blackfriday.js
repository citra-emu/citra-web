// Blackfriday markdown rendering requires a blank line before lists.
module.exports.fixLists = function(markdown) {
  var lines = markdown.split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
      // If it's the start of the file, ignore to prevent an index issue.
      if (i > lines.length) { return; }
      if (i == 0 || lines[i] == '\n') { continue; }

      // Search for the start of a list designated by the * character.
      if (lines[i].startsWith("* ") && lines[i - 1].startsWith("* ") == false) {
        i = i + 1;
        lines.splice(i - 1, 0, '');
      }
  }

  return lines.join('\r\n');
}

module.exports.fixLinks = function(markdown) {
  let cleaned = markdown;

  // Replacing tags like [[Common Issues on Windows|Common Issues]]
  cleaned = markdown.replace(/\[\[(.*)\|(.*)\]\]/g, function(match, p1, p2) {
    return `[${p1}](${url(p2)})`
  });

  // Replacing tags like [[Common Issues]]
  cleaned = markdown.replace(/\[\[(.*)\]\]/g, function(match, p1) {
    return `[${p1}](${url(p1)})`
  });

  return cleaned;
}
