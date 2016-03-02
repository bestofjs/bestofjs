import React from 'react';
import Delta from './Delta';

const DeltaBar = (props) => {
  const deltas = props.data;
  return (
    <div>
      <p className="star-added">
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
        <Delta key={ i } value={ item } />
      ) }
      </div>
  </div>
  );
};
module.exports = DeltaBar;
