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
  notRequired: ['birthplace', 'moviefilmography', 'tvshowFilmography'],
  mediaSelectors: {
    name: Object.assign({}, Media.prototype, {
      name: 'name',
      patterns: [{
        selector: { path: '.bottom_divider', transform: null }, childSelectors: null
      }]
    }),
    birthdate: Object.assign({}, Media.prototype, {
      name: 'birthdate',
      patterns: [{
        selector: { path: 'div.celeb_bio_row:nth-child(3) > time:nth-child(2)', transform: null },
        childSelectors: null
      }]

    }),

    birthplace: Object.assign({}, Media.prototype, {
      name: 'birthplace',
      patterns: [{
        selector: {
          path: 'div.celeb_bio_row:nth-child(4)',
          transform: ($, birthplace) => {
            return birthplace.text().replace(/Birthplace:/, '').trim()
          }
        },
        childSelectors: null
      }]
    }),

    summary: Object.assign({}, Media.prototype, {
      name: 'summary',
      patterns: [{
        selector: {
          path: '.celeb_summary_bio',
          transform: null
        },
        childSelectors: null
      }]
    }),

    movieFilmography: Object.assign({}, Media.prototype, {
      name: 'movieFilmography',
      patterns: [{
        selector: {
          path: '#filmographyTbl', transform: null
        },
        childSelectors: [
          {
            name: 'filmUrl',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(2) > a:nth-child(1)',
              transform: ($, filmEntries) => {
                let f = [];
                filmEntries.each(function (index, value) {
                  f.push($(value).attr('href'));
                });
                return f;
              }
            },
            childSelectors: null
          },

          {
            name: 'filmName',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(2) > a:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },

          {
            name: 'roles',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(3) > ul:nth-child(1)',
              transform: ($, roles) => {
                let r = [];
                roles.each(function (index, value) {
                  let rs = [];
                  $(value).find('li').each(function (i, v) {
                    rs.push($(v).text().trim());
                  });
                  r.push(rs);
                });
                return r;

              }
            },
            childSelectors: null
          },

          {
            name: 'boxoffice',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(4)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },
          {
            name: 'year',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(5)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          }


        ]
      }]
    }),


    tvshowFilmography: Object.assign({}, Media.prototype, {
      name: 'tvshowFilmography',
      patterns: [{
        selector: {
          path: '#tvFilmographyTbl', transform: null
        },
        childSelectors: [
          {
            name: 'tvshowUrl',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(2) > a:nth-child(1)',
              transform: ($, filmEntries) => {
                let f = [];
                filmEntries.each(function (index, value) {
                  f.push($(value).attr('href'));
                });
                return f;
              }
            },
            childSelectors: null
          },

          {
            name: 'tvshowName',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(2) > a:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },

          {
            name: 'roles',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(3) > ul:nth-child(1)',
              transform: ($, roles) => {
                let r = [];
                roles.each(function (index, value) {
                  let rs = [];
                  $(value).find('li').each(function (i, v) {
                    rs.push($(v).text().trim().replace(/\B\s*/g, '').replace(/\n/g, ', '));
                  });
                  r.push(rs);
                });
                return r;
              }
            },
            childSelectors: null
          },

          {
            name: 'year',
            selector: {
              path: 'tbody:nth-child(2) > tr > td:nth-child(4) > ul:nth-child(1) > li:nth-child(1) > span:nth-child(1)',
              transform: Helpers.arrayFromChildNodes
            },
            childSelectors: null
          },

        ]
      }]
    })


  }
}; 