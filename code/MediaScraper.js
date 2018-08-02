/*
    program takes in a json of media urls
    for each media url, navigate to the media page
    and collect media information, etc.
    returns a json of all the parsed data
*/

const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');

module.exports.MediaScraper = class MediaScraper {
  constructor(entries, options) {
    if (!entries) {
      throw new Error('No entries');
    }
    this.entries = entries;
    this.options = options;
  }

  /* do search() on multiple entries synchronously
   * returns 
  **/
  bigSearch() {

    let self = this;
    let delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    let queryResults = [];

    // perform search on each entry synchronously
    return this.entries.reduce(function (promise, entry) {
      return promise.then(function (rslt) {
        if (rslt !== undefined && rslt[1] !== undefined) {
          queryResults.push(rslt[1]);
        }
        console.log('requesting...', entry.url);
	// we can add a delay between requests if we chain a delay promise followed by the search promise
        return Promise.all([delay(self.options.reqDelay), self.search(self.options, entry.url)]);
      })
    }, Promise.resolve()).then(lastQuery => {
      // handle the last query
      queryResults.push(lastQuery[1]);
      // finally resolve, and return all the queryResults
      return Promise.resolve(queryResults);
    });

  }


  search(options, mediaUrl) {

    // helper to merge entries from nested mediaSelector with more than 1 entry
    let createEntry = (keys, arrayOfValueArrays) => {
      let entries = [];
      // all arrays must be of same length
      for (let i = 0; i < arrayOfValueArrays[0][keys[0]].length; i++) {
        let entry = {};
        // add properties
        for (let j = 0; j < keys.length; j++) {
          entry[keys[j]] = arrayOfValueArrays[j][keys[j]][i];
        }
        entries.push(entry);
      }
      return entries;
    };

    // this function depends on CheerioJS objects
    // the Cheerio object "$" is used for parsing html
    // this function descends the "options" object until we get to the leaf.
    // when visiting each node: 
    // * the parser can either pass through to the next node.
    // * or the parser can pass the raw value or process it before passing it to the next node.
    let recursiveParser = ($, context, mediaSelector, explicitPropertyName) => {
      if (mediaSelector.childSelectors === null || mediaSelector.pattern().childSelectors === null) {
        let result;
        let o = {};
        if (mediaSelector.selector) {
          if (Array.isArray(mediaSelector.selector)) {
            result = typeof (context) === 'function' ?
              context(mediaSelector.selector[0].path) : context.find(mediaSelector.selector[0].path);
            o[mediaSelector.name === null ? explicitPropertyName : mediaSelector.name] =
              mediaSelector.selector[0].transform === null ?
                result.text().trim() : mediaSelector.selector[0].transform($, result);

          } else {
            result = typeof (context) === 'function' ?
              context(mediaSelector.selector.path) : context.find(mediaSelector.selector.path);
            o[mediaSelector.name === null ? explicitPropertyName : mediaSelector.name] =
              mediaSelector.selector.transform === null ?
                result.text().trim() : mediaSelector.selector.transform($, result);
          }
        } else {
          if (typeof (context) === 'function') {
            result = context(mediaSelector.pattern().selector.path);
          } else {
            result = context.find(mediaSelector.pattern().selector.path);
          }
          if (mediaSelector.name === null) {
            if (mediaSelector.pattern().selector.transform === null) {
              o[explicitPropertyName] = result.text().trim();
            } else {
              o[explicitPropertyName] = mediaSelector.pattern().selector.transform($, result);
            }
          }
          else {
            if (mediaSelector.pattern().selector.transform === null) {
              o[mediaSelector.name] = result.text().trim();
            } else {
              o[mediaSelector.name] = mediaSelector.pattern().selector.transform($, result);
            }
          }
        }
        return o;
      }
      else {
        let o = {};
        o[mediaSelector.name] = [];
        if (mediaSelector.pattern().childSelectors.length === 1) {
          // pass parent property name as child property name since this returns an array
          return recursiveParser($, $(mediaSelector.pattern().selector.path), mediaSelector.pattern().childSelectors[0], mediaSelector.name);
        }
        else {
          let vals = [];
          let keys = [];
          mediaSelector.pattern().childSelectors.forEach(element => {
            keys.push(element.name);
            vals.push(recursiveParser($, $(mediaSelector.pattern().selector.path), element));
          });
          o[mediaSelector.name] = createEntry(keys, vals);
        }
        // merge arrays into objects
        return o;
      }
    }

    /*
     * iterate through the search patterns specified in the options file
     * until one of the search patterns returns the data we're looking for.
     */
    let tryPattern = ($, mediaSelector) => {
      let noResult;
      let result;
      do {
        result = recursiveParser($, $, mediaSelector);
        noResult = result[mediaSelector.name].length === 0;
        if (noResult) { mediaSelector.nextPattern() }
        else { break; }
      } while (mediaSelector.c > 0);
      return result;
    };

    let query = {
      url: options.host + (mediaUrl ? mediaUrl : '')
    };

    return request(query).then((res) => {
      // load the html page
      let $ = cheerio.load(res, { normalizeWhitespace: true });
      let o = {};

      if (mediaUrl) {
        o['url'] = mediaUrl;
      }

      Object.keys(options.mediaSelectors).forEach(key => {
        o[key] = tryPattern($, options.mediaSelectors[key])[key];
      });
      return new Promise((resolve) => {
        resolve(o);
      });
    }).catch((err) => {
      // got 404, return null, continue
    });

  }
};
