import React, { Component } from 'react'
import Heatmap from './Heatmap'

class HeatmapContainer extends Component {
  constructor() {
    super()
    this.state = { active: null, selected: false }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(value) {
    this.setState({ active: value, selected: true })
  }
  render() {
    const { deltas } = this.props
    const today = new Date()
    const getDate = i => {
      return new Date(new Date().setDate(today.getDate() - i - 1))
    }
    const values = reverse(deltas).map((delta, i) => ({
      date: getDate(i),
      count: delta
    }))
    const { active, selected } = this.state
    return (
      <>
        <p>Stars added on GitHub, day by day</p>
        <Heatmap
          {...this.props}
          values={values}
          active={active}
          selected={selected}
          onClick={this.handleClick}
        />
      </>
    )
  }
}

const reverse = array => {
  const reversed = array.slice()
  reversed.reverse()
  return reversed
}

export default HeatmapContainer
