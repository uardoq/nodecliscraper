const fs = require('fs');
/* MovieScraperImpl implements MediaScraper.js */
const { MediaScraper } = require('./code/MediaScraper.js');
/* movieOptions specified the lookup pattern for the scraper */
const movieOptions = require('./options/movie-options');

var INPUT_FILE = process.argv[2];
var OUTPUT_FILE = process.argv[3];

try {
  var json = JSON.parse(fs.readFileSync(INPUT_FILE));
  var ms = new MediaScraper(json.movies, movieOptions);

  // iterate over all entries, scrape info and return
  ms.bigSearch()
    .then(result => {

      /* check for empty fields and if they are required.  */
      let checkProperties = function (obj) {
        for (var key in obj) {
          if (movieOptions.notRequired.includes(key)) {
            continue;
          }
          if (Array.isArray(obj[key]) && obj[key].length < 1) {
            return false;
          }
          if (obj[key] === "") {
            return false;
          }
        }
        return true;
      };

      /* filter out data with missing required fields, we only want complete data sets */
      let cleanedResults = [];
      for (let i = 0; i < result.length; i++) {
        if (checkProperties(result[i])) {
          cleanedResults.push(result[i]);
        }
      }

      console.log(`Parsed ${result.length} urls, after clean up, got ${cleanedResults.length} results`)

      let f = JSON.stringify(cleanedResults, null, 4);
      fs.writeFileSync(OUTPUT_FILE, f);
    });
}
catch (e) {
  console.error(e);
} 
