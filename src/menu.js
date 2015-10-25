//A helper to get an array from a "node list" object
function $$(selector, context) {
  context = context || document;
  var elements = context.querySelectorAll(selector);
  return Array.prototype.slice.call(elements);
}

function getNodes() {
  return $$('#layout, .menu-link, #menu');
}

export default ({
  toggle: function () {
    getNodes().forEach( element => element.classList.toggle('active'));
  },
  hide: function () {
    getNodes().forEach( element => element.classList.remove('active'));
  }
});
