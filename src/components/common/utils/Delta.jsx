var React = require('react');

var Delta = React.createClass({
  render() {
    var { value, big } = this.props;

    var formatDelta = function (d) {
      if (d === 0) return '=';
      if (d < 0) return '- ' + Math.abs(d);
      return '+ ' + d;
    };
    var getStyle = function (d) {
      // var bgColors = ['#f6faaa','#FEE08B','#FDAE61','#F46D43','#D53E4F','#9E0142'];
      // Generated from Chroma page `chroma.scale(bgColors).colors(50)`
      var bgColors = ["#f6faaa", "#f6f7a6", "#f7f4a3", "#f8f2a0", "#f9ef9d", "#faec9a", "#faea97", "#fbe793", "#fce490", "#fde28d", "#fdde8a", "#fdd985", "#fdd481", "#fdcf7d", "#fdca79", "#fdc574", "#fdc070", "#fdbb6c", "#fdb667", "#fdb163", "#fcab5f", "#fba45c", "#fa9e59", "#f99756", "#f89053", "#f88a50", "#f7834d", "#f67c4a", "#f57647", "#f46f44", "#f26a43", "#ee6544", "#eb6046", "#e85b47", "#e55648", "#e25249", "#df4d4b", "#db484c", "#d8434d", "#d53e4e", "#d0394d", "#ca324c", "#c52c4b", "#bf2649", "#ba2048", "#b41947", "#ae1345", "#a90d44", "#a30743", "#9e0142"];
      var textColor = d < 40 ? `rgba(55, 55, 55, 0.9)` : 'rgba(255, 255, 255, 0.9)';
      return {
        backgroundColor: bgColors[Math.min(parseInt(value / 2, 10), bgColors.length - 1)],
        color: textColor,
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
