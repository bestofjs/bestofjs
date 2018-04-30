// import styled from 'styled-components'

import NormalButton from './NormalButton'

const LoadingButton = NormalButton.extend`
  position: relative;
  cursor: default;
  text-shadow: none !important;
  color: transparent !important;
  opacity: 1;
  pointer-events: auto;
  -webkit-transition: all 0s linear, opacity 0.1s ease;
  transition: all 0s linear, opacity 0.1s ease;
  &:before {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    margin: -0.64285714em 0 0 -0.64285714em;
    width: 1.28571429em;
    height: 1.28571429em;
    border-radius: 500rem;
    border: 0.2em solid rgba(0, 0, 0, 0.15);
  }
  &:after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    margin: -0.64285714em 0 0 -0.64285714em;
    width: 1.28571429em;
    height: 1.28571429em;
    animation: button-spin 0.6s linear;
    animation-iteration-count: infinite;
    border-radius: 500rem;
    border-color: #fff transparent transparent;
    border-style: solid;
    border-width: 0.2em;
    box-shadow: 0 0 0 1px transparent;
  }
  @keyframes button-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export default LoadingButton
