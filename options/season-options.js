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
  reqDelay: 1000,
  notRequired: ['premiered'],
  mediaSelectors: {

    summary: Object.assign({}, Media.prototype, {
      name: 'summary',
      patterns: [{
        selector: { path: '#movieSynopsis', transform: null },
        childSelectors: null
      }]
    }),

    premiered: Object.assign({}, Media.prototype, {
      name: 'premiered',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(2) > div:nth-child(2)', transform: null },
        childSelectors: null
      }]
    }),

    network: Object.assign({}, Media.prototype, {
      name: 'network',
      patterns: [{
        selector: { path: 'li.meta-row:nth-child(1) > div:nth-child(2)', transform: null },
        childSelectors: null
      }]
    }),

    episodesUrl: Object.assign({}, Media.prototype, {
      name: 'episodesUrl',
      patterns: [{
        selector: { path: '#episode-list-root', transform: null },
        childSelectors: [
          {
            name: null,
            selector: {
              path: 'a',
              transform: ($, episodes) => {
                let urls = [];
                episodes.each(function (index, value) {
                  urls.push($(value).attr('href'));
                });
                return urls;
              }
            },
            childSelectors: null
          }
        ]
      }]
    }),

  }
};