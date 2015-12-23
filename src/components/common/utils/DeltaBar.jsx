import React from 'react';
import Delta from './Delta';

const DeltaBar = React.createClass({

  render() {
    const deltas = this.props.data;
    return (
      <div>
        <p style={{ margin: '0.5em 0' }}>
          <span className="octicon octicon-calendar"></span>{' '}
          { deltas.length === 1 ? (
            'Stars added yesterday:'
          ) : (
            'Stars added during the last ' + deltas.length + ' days:'
          )
          }
        </p>
        <div className="delta-bar-container">
        { deltas.map((item, i) =>
          <DeltaBar.Item value={ item } key={ i } />
        ) }
        </div>
    </div>
    );
  }

});

DeltaBar.Item = React.createClass({

  render() {
    const style = {
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
