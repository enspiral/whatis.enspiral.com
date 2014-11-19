var QS = require('query-string');

module.exports = function () {
  return function (deck) {
    // get query string
    var query = QS.parse(window.location.search.substring(1));
    if (query.highres) {
      deck.parent.classList.add('svg');
    }
  };
};
