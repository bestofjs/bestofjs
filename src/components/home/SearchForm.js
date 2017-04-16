import React from 'react'
import debounce from 'lodash.debounce'

class SearchForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: this.props.searchText
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount () {
    this.emitChangeDelayed = debounce(this.emitChange, 300)
  }
  emitChange (text) {
    this.props.onChange(text)
  }
  handleChange (e) {
    const text = e.target.value
    this.setState({
      text
    })
    this.emitChangeDelayed(text)
  }
  handleSubmit (e) {
    e.preventDefault()
    this.emitChange(this.state.text)
  }
  render () {
    const { highlight } = this.props
    return (
      <form id="searchbox" onSubmit={this.handleSubmit} className={`${highlight ? 'highlight' : ''}`}>
        <input
          type="text"
          onChange={this.handleChange}
          autoFocus
        />
        <span className="mega-octicon octicon-search icon" />
      </form>
    )
  }
}

export default SearchForm
