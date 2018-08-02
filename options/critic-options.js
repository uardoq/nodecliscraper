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
  appendToUrlEnd: '/reviews/',
  reqDelay: 1200,
  notRequired: [],
  mediaSelectors: {
    criticReviews: Object.assign({}, Media.prototype, {
      name: 'criticReviews',
      patterns: [{
        selector: { path: '.review_table', transform: null },
        childSelectors: [
          {
            name: 'criticUrl',
            selector: {
              path: 'div.review_table_row > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)',
              transform: ($, criticEntries) => {
                let urls = [];
                criticEntries.each(function (index, value) {
                  urls.push($(value).attr('href'));
                });
                return urls;
              }
            },
            childSelectors: null
          }, {
            name: 'criticName',
            selector: {
              path: 'div.review_table_row > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },
          {
            name: 'criticOrganization',
            selector: {
              path: 'div.review_table_row > div:nth-child(1) > div:nth-child(3) > a:nth-child(3) > em:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },
          {
            name: 'criticReviewDate',
            selector: {
              path: 'div.review_table_row > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },
          {
            name: 'criticPost',
            selector: {
              path: 'div.review_table_row > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },
          {
            name: 'postUrl',
            selector: {
              path: 'div.review_table_row > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)',
              transform: ($, postUrls) => {
                let urls = [];
                postUrls.each(function (index, value) {
                  urls.push($(value).attr('href'));
                });
                return urls;
              }
            },
            childSelectors: null
          },
          {
            name: 'criticScore',
            selector: {
              path: 'div.review_table_row > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)',
              transform: ($, scores) => {
                let ls = [];
                scores.each(function () {
                  ls.push($(this).text().replace(/Full Review/, '').replace(/\|\sOriginal Score:/, '').trim());
                });
                return ls;
              }
            },
            childSelectors: null
          },
          {
            name: 'criticFresh',
            selector: {
              path: 'div.row.review_table_row > div:nth-child(2) > div:nth-child(1)',
              transform: ($, review) => {
                let ls = [];
                let freshClass = 'fresh';
                review.each(function () {
                  if ($(this).hasClass(freshClass)) {
                    ls.push(true);
                  }
                  else {
                    ls.push(false);
                  }
                });
                return ls;
              }
            },
            childSelectors: null
          }
        ]
      }]
    })

  }
};
