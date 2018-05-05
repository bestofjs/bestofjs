/**
 * A container used to fetch Hall of Fame members if needed
 */

import React from 'react'
import { connect } from 'react-redux'

import { fetchAllHeroes } from '../actions/hofActions'
import Spinner from '../components/common/Spinner'

class FetchHeroes extends React.Component {
  fetchDataIfNeeded = () => {
    const { heroesById } = this.props
    if (Object.keys(heroesById).length === 0) {
      this.fetchData()
    }
  }
  fetchData = () => {
    this.props.fetchAllHeroes()
  }
  componentDidMount() {
    this.fetchDataIfNeeded()
  }
  render() {
    const { loading, children } = this.props
    return loading ? <Spinner /> : children
  }
}

const mapStateToProps = state => {
  return {
    heroesById: state.entities.heroes,
    loading: state.hof.loading
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchAllHeroes: () => dispatch(fetchAllHeroes())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FetchHeroes)
