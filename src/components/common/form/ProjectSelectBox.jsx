import React, { PropTypes } from 'react';
import Select from 'react-select';

const ProjectSelectBox = React.createClass({
  propTypes: {
    // title: PropTypes.string.isRequired,
    // onShow: PropTypes.func.isRequired
  },
  handleChange(values) {
    console.log("Selected: ", values);
    this.props.field.onChange(values);
  },
  render() {
    const { options, field } = this.props;
    return (
      <div>
        <Select
          name="projects"
          value={ field.value }
          options={ options }
          multi
          onChange={ this.handleChange }
        />
      </div>
    );
  }
});
export default ProjectSelectBox;
