mui = require('material-ui')
Colors = mui.Styles.Colors

CustomTheme =
  getPalette: () ->
    primary1Color: Colors.orange900
    canvasColor: '#ECECEC'
  getComponentThemes: (palette) ->
    appBar:
      color: Colors.orange800

module.exports = CustomTheme
