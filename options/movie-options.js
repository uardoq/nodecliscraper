function Media() {
  this.name = '';
  this.childUrl = null;
  this.c = 0;
  this.patterns = [];
}

const Helpers = {
  arrayFromChildNodes: function ($, cheerioArray) {
    let ls = [];
    cheerioArray.each(function () {
      ls.push($(this).text().trim());
    });
    return ls;
  }
};

Media.prototype.pattern = function () {
  return this.patterns[this.c || 0];
}

Media.prototype.nextPattern = function () {
  let p = this.patterns[++this.c];
  if (p) {
    return p;
  } else {
    this.c = 0;
  }
}

module.exports = {
  host: 'https://www.rottentomatoes.com',
  reqDelay: 1200,
  notRequired: ['criticReviews'],
  mediaSelectors: {
    title: Object.assign({}, Media.prototype, {
      name: 'title',
      c: 0,
      patterns: [{
        selector: {
          path: 'h1.title:nth-child(1)', transform: ($, title) => {
            title.children().remove();
            return title.text().trim();
          }
        },
        childSelectors: null
      },
      {
        selector: {
          path: '#movie-title', transform: ($, title) => {
            title.children().remove();
            return title.text().trim();
          }
        },
        childSelectors: null
      }]
    }),
    description: Object.assign({}, Media.prototype, {
      name: 'description',
      patterns: [{
        selector: { path: '#movieSynopsis', transform: null },
        childSelectors: null
      }]
    }),
    rating: Object.assign({}, Media.prototype, {
      name: 'rating',
      patterns: [{
        selector: {
          path: 'li.meta-row:nth-child(1) > div:nth-child(2)', transform: ($, ratingString) => {
            return ratingString.text().replace(/\(.*\)/, '').trim();
          }
        },
        childSelectors: null
      }]
    }),
    genres: Object.assign({}, Media.prototype, {
      name: 'genres',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(2) > div:nth-child(2)', transform: null },
        childSelectors: [{
          name: null,
          selector: {
            path: 'a',
            transform: ($, as) => {
              let ls = [];
              as.each(function () {
                ls.push($(this).text().trim());
              });
              return ls;
            }
          },
          childSelectors: null
        }]
      }]
    }),
    directors: Object.assign({}, Media.prototype, {
      name: 'directors',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(3) > div:nth-child(2)', transform: null },
        childSelectors: [{
          name: null,
          selector: {
            path: 'a', transform: ($, as) => {
              let ls = [];
              as.each(function () {
                ls.push($(this).text().trim());
              });
              return ls;
            }
          },
          childSelectors: null
        }]
      }]
    }),
    writers: Object.assign({}, Media.prototype, {
      name: 'writers',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(4) > div:nth-child(2)', transform: null },
        childSelectors: [{
          name: null,
          selector: {
            path: 'a', transform: ($, as) => {
              let ls = [];
              as.each(function () {
                ls.push($(this).text().trim());
              });
              return ls;
            }
          },
          childSelectors: null
        }]
      }]
    }),
    premiered: Object.assign({}, Media.prototype, {
      name: 'premiered',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(5) > div:nth-child(2)', transform: null },
        childSelectors: [{
          name: null,
          selector: { path: 'time', transform: null },
          childSelectors: null
        }]
      }]
    }),
    runtime: Object.assign({}, Media.prototype, {
      name: 'runtime',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(7) > div:nth-child(2) > time:nth-child(1)', transform: null },
        childSelectors: null
      }]
    }),
    studio: Object.assign({}, Media.prototype, {
      name: 'studio',
      c: 0,
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(8) > div:nth-child(2)', transform: null },
        childSelectors: [{
          name: null,
          selector: [{
            path: 'a', transform: null
          }],
          childSelectors: null
        }]
      }, {
        selector: {
          path: 'li.meta-row:nth-child(8) > div:nth-child(2)', transform: ($, studio) => {
            studio.children().remove();
            return studio.text().trim();
          }
        },
        childSelectors: null
      }],
    }),
    cast: Object.assign({}, Media.prototype, {
      name: 'cast',
      patterns: [{
        selector: { path: '.castSection', transform: null },
        childSelectors: [
          {
            name: 'celebrityURL',
            selector: {
              path: 'div.cast-item > div > a',
              transform: ($, celebEntries) => {
                let urls = [];
                celebEntries.each(function (index, value) {
                  urls.push($(value).attr('href'));
                });
                return urls;
              }
            },
            childSelectors: null
          },
          {
            name: 'celebrityName',
            selector: {
              path: 'div.cast-item > div > a > span', transform: ($, celebEntries) => {
                let names = [];
                celebEntries.each(function () {
                  names.push($(this).text().trim());
                });
                return names;
              }
            },
            childSelectors: null
          },
          {
            name: 'character',
            selector: {
              path: 'div.cast-item > div > span',
              transform: ($, celebEntries) => {
                let chars = [];
                celebEntries.each(function () {
                  chars.push($(this).text().trim().replace(/^as /, ''));
                });
                return chars;
              }
            },
            childSelectors: null
          }
        ]
      }],
    })
  }
};
