var React = require('react');
var Delta = require('./Delta');

var DeltaBar = React.createClass({

  render: function() {
    var deltas = this.props.data;
    return (
      <div>
        <p style={{ margin: '0 1em 0.5em'}}>
          <span className="octicon octicon-calendar"></span>{' '}
          { deltas.length === 1 ? (
            'Stars added yesterday:'
          ) : (
            'Stars added during the last ' + deltas.length + ' days:'
          )
          }
        </p>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        { deltas.map( (item, i) =>
          <DeltaBar.Item value={ item } key={ i } />
        ) }
        </div>
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
