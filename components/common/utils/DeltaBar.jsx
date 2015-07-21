var React = require('react');
var Delta = require('./Delta');

var DeltaBar = React.createClass({

  render: function() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      { this.props.data.map( (item, i) =>
        <DeltaBar.Item value={ item } key={ i } />
      ) }
      </div>
    );
  }

});

DeltaBar.Item = React.createClass({

  render: function() {
    var style = {
      width: 'auto',
      display: 'block',
      flex: '1'
    };
    return (
      <div style={ style }>
        <Delta value={ this.props.value } />
      </div>
    );
  }

});

module.exports = DeltaBar;
