module.exports = function () {
  return function (deck) {
    // disable right click context menu
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
    // add click event listeners
    document.addEventListener('mousedown', function (e) {
      if (e.which == 1) {
        deck.next();
      } else if (e.which == 3) {
        deck.prev();
      }
    });
  };
};
