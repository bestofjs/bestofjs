import styled from 'styled-components'

const bestofjsOrange = '#e65100'
const cardBorderColor = '#cbcbcb'
const textSecondaryColor = '#777'

const Card = styled.div`
  flex: 1;
  padding: 0;
  background-color: #fff;
  border: 1px solid ${cardBorderColor};
  .card-block {
    display: flex;
    align-items: center;
    color: inherit;
    flex: 1;
  }
  .card-block:hover {
    text-decoration: none;
    color: inherited;
    background-color: #fff7eb;
    color: #000;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .header-text {
    padding: 0 1em;
  }
  .hero-card.current-user .header {
    background-color: ${bestofjsOrange};
    color: #fff;
  }
  .hero-card.current-user .header .text-secondary {
    color: rgba(255, 255, 255, 0.6);
  }
  .name {
    font-size: 1.3em;
  }
  .inner {
    padding: 1rem;
    border-top: 1px dashed ${cardBorderColor};
    color: ${textSecondaryColor};
  }
  .icon {
    color: #fa9e59;
    margin-right: 5px;
  }
  .github-data {
    margin-top: 0.2em;
  }
`

export default Card
