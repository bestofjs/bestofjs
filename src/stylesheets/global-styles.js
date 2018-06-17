/**
 * Using the helper to write global CSS
 * https://www.styled-components.com/docs/api#injectGlobal
 */
import { injectGlobal } from 'styled-components'

injectGlobal`
  html, body {
    margin: 0;
  }
  html,
  input,
  textarea,
  select {
    font-family: 'Roboto Slab', sans-serif;
    box-sizing: border-box;
  }  
  html {
    font-size: 14px;
  }
  @media (min-width: 768px) {
    html {
      font-size: 16px;
    }
  }
  body {
    font-size: 1rem;
    line-height: 1.3333;
    color: var(--textPrimaryColor);
  }  
`
