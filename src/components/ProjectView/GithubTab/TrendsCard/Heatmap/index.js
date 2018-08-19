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
    const values = deltas
      .map((delta, i) => ({ date: getDate(i), count: delta }))
      .reverse()
    const { active, selected } = this.state
    return (
      <Heatmap
        {...this.props}
        values={values}
        active={active}
        selected={selected}
        onClick={this.handleClick}
      />
    )
  }
}

export default HeatmapContainer
