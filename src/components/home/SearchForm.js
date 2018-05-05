import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import styled from 'styled-components'

const colorOn = '#fa9e59'
const colorOff = '#cbcbcb'

const Form = styled.form`
  box-sizing: border-box;
  padding: 3px 8px;
  border: 3px solid ${colorOff};
  border-radius: 6px;
  font-size: 16px;
  outline: 0;
  display: flex;
  align-items: center;
  input {
    outline: 0;
    border-style: none;
    font-size: 16px;
    @media (max-width: 700px) {
      max-width: 150px;
    }
  }
  .icon {
    color: ${colorOff};
  }
  &.highlight {
    border-color: ${colorOn};
  }
  &.highlight .icon {
    color: ${colorOn};
  }
`

class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.searchText
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.emitChangeDelayed = debounce(this.emitChange, 300)
  }
  emitChange(text) {
    this.props.onChange(text)
  }
  handleChange(e) {
    const text = e.target.value
    this.setState({
      text
    })
    this.emitChangeDelayed(text)
  }
  handleSubmit(e) {
    e.preventDefault()
    this.emitChange(this.state.text)
  }
  render() {
    const { highlight } = this.props
    return (
      <Form
        id="searchbox"
        onSubmit={this.handleSubmit}
        className={`${highlight ? 'highlight' : ''}`}
      >
        <input type="text" onChange={this.handleChange} autoFocus />
        <span className="mega-octicon octicon-search icon" />
      </Form>
    )
  }
}

export default SearchForm
