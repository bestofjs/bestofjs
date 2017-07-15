export default function(win) {
  const key = 'bestofjs_url'
  return {
    save() {
      const url = win.location.pathname
      win.localStorage.setItem(key, url)
    },
    get(resetUrl) {
      const url = win.localStorage[key]
      if (resetUrl) this.reset()
      return url
    },
    reset() {
      win.localStorage.removeItem(key)
    }
  }
}
