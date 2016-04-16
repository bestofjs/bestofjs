import React from 'react';

const MainContent = React.createClass({
  render() {
    return (
      <div id="main-content" className="container" {...this.props}>
        { this.props.children }
      </div>
    );
  }
});
module.exports = MainContent;
