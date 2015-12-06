var React = require('react');
var TagLabel = require('./TagLabel');

var TagList = React.createClass({

  render: function() {
    return (
      <div>
        {this.props.tags.map( (tag, index) =>
          <div style={{ marginBottom: 10 }} key={ tag.id }>
            <TagLabel tag={ tag }/>
          </div>
        )}
      </div>
    );
  }

});

TagList.Item = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{ this.props.tag.name }</td>
      </tr>
    );
  }
});

module.exports = TagList;
