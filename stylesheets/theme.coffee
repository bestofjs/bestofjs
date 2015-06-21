mui = require('material-ui')
Colors = mui.Styles.Colors

CustomTheme =
  getPalette: () ->
    primary1Color: Colors.orange900
  getComponentThemes: (palette) ->
    appBar:
      color: Colors.orange800

module.exports = CustomTheme
