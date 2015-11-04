var React = require('react');

var Delta = React.createClass({

  lightenDarkenColor: function(col,amt) {
      var usePound = false;
      if ( col[0] == "#" ) {
          col = col.slice(1);
          usePound = true;
      }

      var num = parseInt(col,16);

      var r = (num >> 16) + amt;

      if ( r > 255 ) r = 255;
      else if  (r < 0) r = 0;

      var b = ((num >> 8) & 0x00FF) + amt;

      if ( b > 255 ) b = 255;
      else if  (b < 0) b = 0;

      var g = (num & 0x0000FF) + amt;

      if ( g > 255 ) g = 255;
      else if  ( g < 0 ) g = 0;

      return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  },

  render: function() {

    var {value, big} = this.props;

    var formatDelta = function (value) {
      if (value === 0) return '=';
      if (value < 0) return  '- ' + Math.abs(value);
      return '+ ' + value;
    };
    var getStyle = function (value) {

      var bgColors = ['#f6faaa','#FEE08B','#FDAE61','#F46D43','#D53E4F','#9E0142'];
      var colors = ['#555555', '#555555', '#555555', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.9)'];
      var index = Math.floor(value / 10);
      index = Math.min(index, colors.length - 1);
      return {
        //backgroundColor: self.lightenDarkenColor(bgColors[index], 50),
        backgroundColor: bgColors[index],
        //opacity: '0.5',
        //borderTopWidth: 3,
        //borderTopStyle: 'solid',
        borderTopColor: bgColors[index],

        color: colors[index],
        fontSize: big ? 'inherited' : 13,
        textAlign: 'center'
      };
    };

    var style = getStyle(value);
    if (value < 0) {
      style.color = '#cc0000';
    }
    style.padding = '2px 5px';

    return (
      <div style={ style }>
        { formatDelta(value) }
        { this.props.icon && value !== 0 && (
          <span className="octicon octicon-star" style={{ fontSize: 14, marginLeft: 4 }}></span>
        ) }
      </div>
    );
  }

});

module.exports = Delta;
