import React from 'react'
import styled from 'styled-components'

import NormalButton from './NormalButton'
import LoadingButton from './LoadingButton'

const Button = ({ loading, children, ...rest }) => {
  const Component = loading ? LoadingButton : NormalButton
  return <Component {...rest}>{children}</Component>
}

export default styled(Button)`` // need to export a "styled" component, so that we can call `withComponent` later
