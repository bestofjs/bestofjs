import Slideout from 'slideout'
// A helper to get an array from a "node list" object
function $$ (selector, ctx) {
  const context = ctx || document
  const elements = context.querySelectorAll(selector)
  return Array.prototype.slice.call(elements)
}

let slideout = null

export default ({
  open: false,
  start () {
    const self = this
    slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('menu'),
      'padding': 280,
      'tolerance': 70
    })
    $$('.menu-link').forEach(function (node) {
      node.addEventListener('click', function () {
        slideout.toggle()
        self.open = true
      })
    })
  },
  toggle () {
    slideout.toggle()
  },
  hide () {
    if (slideout) slideout.close()
  }
})
