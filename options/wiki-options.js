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
  host: 'https://en.wikipedia.org/wiki',
  reqDelay: 500,
  notRequired: [''],
  mediaSelectors: {

    awardWinners: Object.assign({}, Media.prototype, {
      name: 'awardWinners',
      patterns: [{
        selector: { path: '.wikitable', transform: null },
        childSelectors: [

          {
            name: 'filmName',
            selector: {
              path: 'tbody:nth-child(1) > tr > td:nth-child(1)',
              transform: ($, rows) => {
                let ls = [];
                rows.each(function (i, row) {
                  if ($(this).parent().attr('style')) {
                    ls.push($(this).find('a').text().trim());
                  }
                });
                return ls;
              }
            },
            childSelectors: null

          },

          {
            name: 'yearWon',
            selector: {
              path: 'tbody:nth-child(1) > tr > td:nth-child(2)',
              transform: ($, rows) => {
                let ls = [];
                rows.each(function (i, row) {
                  if ($(this).parent().attr('style')) {
                    ls.push($(this).text().trim());
                  }
                });
                return ls;
              }

            },
            childSelectors: null
          },

          {
            name: 'awards',
            selector: {
              path: 'tbody:nth-child(1) > tr > td:nth-child(3)',
              transform: ($, rows) => {
                let ls = [];
                rows.each(function (i, row) {
                  if ($(this).parent().attr('style')) {
                    ls.push($(this).text().trim());
                  }
                });
                return ls;
              }
            },
            childSelectors: null

          },

          {
            name: 'nominations',
            selector: {
              path: 'tbody:nth-child(1) > tr > td:nth-child(4)',
              transform: ($, rows) => {
                let ls = [];
                rows.each(function (i, row) {
                  if ($(this).parent().attr('style')) {
                    ls.push($(this).text().trim());
                  }
                });
                return ls;
              }
            },
            childSelectors: null

          }
        ]
      }]
    }),



  }
};