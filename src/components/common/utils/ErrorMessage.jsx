import React, { PropTypes, Component } from 'react';
class ErrorMessage extends Component {
  render() {
    return (
      <div style={{ margin: '1em 0', padding: '1em', backgroundColor: '#fff6f6', color: '#9f3a38', border: '1px solid #e0b4b4' }}>
        { this.props.text }
      </div>
    );
  }
}

export default ErrorMessage;
