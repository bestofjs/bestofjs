/**
 * A container used to fetch Hall of Fame members if needed
 */

import React from 'react'
import { connect } from 'react-redux'

import { fetchAllHeroes } from '../actions/hofActions'
import { Spinner } from '../components/core'

class FetchHeroes extends React.Component {
  state = {
    loading: false
  }
  fetchDataIfNeeded = () => {
    const { heroesById } = this.props
    if (Object.keys(heroesById).length === 0) {
      this.fetchData()
    }
  }
  fetchData = async () => {
    this.setState({ loading: true })
    await this.props.fetchAllHeroes()
    this.setState({ loading: false })
  }
  componentDidMount() {
    this.fetchDataIfNeeded()
  }
  render() {
    const { children } = this.props
    const { loading } = this.state
    return loading ? <Spinner /> : children
  }
}

const mapStateToProps = state => {
  return {
    heroesById: state.entities.heroes
    // loading: state.hof.loading
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchAllHeroes: () => dispatch(fetchAllHeroes())
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FetchHeroes)
