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
  reqDelay: 500,
  notRequired: [],
  mediaSelectors: {
    summary: Object.assign({}, Media.prototype, {
      name: 'summary',
      patterns: [{
        selector: { path: '#movieSynopsis', transform: null },
        childSelectors: null
      }]
    }),

    // network: Object.assign({}, Media.prototype, {
    //   name: 'network',
    //   patterns: [{
    //     selector: { path: 'li.meta-row:nth-child(2) > div:nth-child(2)', transform: null },
    //     childSelectors: null
    //   }]
    // }),

    airDate: Object.assign({}, Media.prototype, {
      name: 'airDate',
      c: 0,
      patterns: [{
        selector: {
          path: 'li.meta-row:nth-child(2) > div:nth-child(2)', transform: ($, airDate) => {
            // check if sibling label is 'air date'
            let label = airDate.siblings();
            if (label.text().trim().match(/Air Date:/)) {
              return airDate.text().trim();
            }
            else {
              return '';
            }
          }
        },
        childSelectors: null
      }, {
        selector: {
          path: 'li.meta-row:nth-child(3) > div:nth-child(2)', transform: ($, airDate) => {
            // check if sibling label is 'air date'
            let label = airDate.siblings();
            if (label.text().trim().match(/Air Date:/)) {
              return airDate.text().trim();
            }
            else {
              return '';
            }
          }
        },
        childSelectors: null
      }]
    }),
  }
}; 