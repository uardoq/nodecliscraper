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
  reqDelay: 600,
  notRequired: ['genres', 'network', 'premiere', 'execProducers'],
  mediaSelectors: {


    title: Object.assign({}, Media.prototype, {
      name: 'title',
      patterns: [{
        selector: {
          path: 'h1.title',
          transform: ($, title) => {
            title.children().remove();
            return title.text().trim();
          }
        }, childSelectors: null
      }]
    }),

    description: Object.assign({}, Media.prototype, {
      name: 'description',
      patterns: [{
        selector: { path: '#movieSynopsis', transform: null },
        childSelectors: null
      }]
    }),

    genres: Object.assign({}, Media.prototype, {
      name: 'genres',
      c: 0,
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(1) > div:nth-child(2)', transform: null },
        childSelectors: [{
          name: null,
          selector: {
            path: 'a',
            transform: Helpers.arrayFromChildNodes
          },
          childSelectors: null
        }]
      },
      {
        selector: { path: 'li.meta-row:nth-child(1) > div:nth-child(2)', transform: null },
        childSelectors: null
      },
      {
        selector: { path: '#detail_panel > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)', transform: null },
        childSelectors: null
      }]
    }),

    network: Object.assign({}, Media.prototype, {
      name: 'network',
      c: 0,
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(2) > div:nth-child(2)', transform: null },
        childSelectors: null
      },
      {
        selector: { path: '#detail_panel > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', transform: null },
        childSelectors: null
      } ]
    }),

    premiere: Object.assign({}, Media.prototype, {
      name: 'premiere',
      c: 0,
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(3) > div:nth-child(2)', transform: null },
        childSelectors: null
      },
      {
        selector: { path: '#detail_panel > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)', transform: null },
        childSelectors: null
      }]
    }),

    execProducers: Object.assign({}, Media.prototype, {
      name: 'execProducers',
      patterns: [{
        selector: { path: '#episode-list-root', transform: null },
        childSelectors: [
          {
            name: 'executiveUrl',
            selector: {
              path: 'a',
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
            name: 'executiveName',
            selector: {
              path: 'a', transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },
        ]
      }],
    }),

    seasons: Object.assign({}, Media.prototype, {
      name: 'seasons',
      patterns: [{
        selector: {
          path: '#seasonList > div:nth-child(2) a', transform: ($, seasons) => {
            let urls = [];
            seasons.each(function (index, value) {
              urls.push($(value).attr('href'));
            });
            return urls;
          }
        },
        childSelectors: null
      }]
    }),

    cast: Object.assign({}, Media.prototype, {
      name: 'cast',
      patterns: [{
        selector: { path: '.castSection', transform: null },
        childSelectors: [{
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
            path: 'div.cast-item > div > a > span', transform: Helpers.arrayFromChildNodes
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
        }]
      }]
    }),
  }
};