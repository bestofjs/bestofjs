import { connect } from 'react-redux'
import { findProjectByNpmName } from '../selectors/project'

function mapStateToProps(state, props) {
  const { packageNames } = props
  const packages = packageNames.map(name => ({
    name,
    project: findProjectByNpmName(name)(state)
  }))
  return {
    packages
  }
}

// HoC used to inject user's `packages` prop. from `packageNames`
// INPUT: a component with a `packageNames` prop: ['redux']
// OUTPU: a component with a `packages` prop] [{ name: 'redux', project}]
const withPackageData = Component => {
  return connect(mapStateToProps)(Component)
}

export default withPackageData
