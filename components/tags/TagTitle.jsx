var React = require('react');

require('../../stylesheets/tag.styl');

var TagTitle = React.createClass({

  render: function() {
    var tag = this.props.tag;
    var style={

    };
    return (
      <a className="tag-title" onClick={ this.props.onClick } href="">
        <span style={{ display: 'inline-block' }}>{ tag.name }</span>
        {false && <i className="fa fa-close"></i>}
        <span className="close-icon" style={{ fontSize: 22, marginLeft: 5, display: 'inline-block' }}>&times;</span>
      </a>
    );
  }

});

module.exports = TagTitle;
