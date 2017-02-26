var fs = require('fs');
var logger = require('winston');
var jsonfile = require('jsonfile');

var outputFile = '../../site/data/twitter.json';

var tweets = [
  {
    "id": "817201197065109505",
    "order": 1,
    "date": "01/05/2017",
    "author": "citraemu",
    "image": "https://pbs.twimg.com/profile_images/699782793736359936/eMLbnRNR_normal.png",
    "message": "Citra nightlies are back up and better than ever! Sorry for the delay and Happy New Year!"
  },
  {
    "id": "776626520110399488",
    "order": 2,
    "date": "09/15/2016",
    "author": "citraemu",
    "image": "https://pbs.twimg.com/profile_images/699782793736359936/eMLbnRNR_normal.png",
    "message": "After much anticipation, Citra now has a JIT! Props again to @MerryMage for another massive contribution to the project!!"
  },
  {
    "id": "733831257398747137",
    "order": 3,
    "date": "05/20/2016",
    "author": "citraemu",
    "image": "https://pbs.twimg.com/profile_images/699782793736359936/eMLbnRNR_normal.png",
    "message": "Props to @MerryMage for a fantastic job on Citra's audio support https://t.co/Z23AWxcDkf"
  }
];

jsonfile.writeFile(outputFile, tweets, function (err) {
 if (err) { logger.error(err); return; }
 logger.info(`Wrote ${tweets.length} tweets to ${outputFile}`)
})
