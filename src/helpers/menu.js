import Slideout from 'slideout';

//A helper to get an array from a "node list" object
function $$(selector, context) {
  context = context || document;
  var elements = context.querySelectorAll(selector);
  return Array.prototype.slice.call(elements);
}

let slideout = null;

export default ({
  open: false,
  start: function () {
    let self = this;
    slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('menu'),
      'padding': 280,
      'tolerance': 70
    });
    $$('.menu-link').forEach(function (node) {
      node.addEventListener('click', function() {
        slideout.toggle();
        self.open = true;
      });
    });
  },
  toggle: function () {
    slideout.toggle();
  },
  hide: function () {
    slideout.close();
  }
});
