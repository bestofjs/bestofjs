var React = require('react');

var Delta = React.createClass({

  render: function() {

    var value = this.props.value;

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
        backgroundColor: bgColors[index],
        color: colors[index]
      };
    };

    var style = getStyle(value);
    if (value < 0) {
      style.color = '#cc0000';
    }
    style.padding = '2px 5px';

    return (
      <span style={ style }>{ formatDelta(value) }</span>
    );
  }

});

module.exports = Delta;
