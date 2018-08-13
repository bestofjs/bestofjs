import styled from 'styled-components'

const cardBorderColor = '#cbcbcb'
const textPrimaryColor = '#333'

const Card = styled.div`
  margin-bottom: 2rem;
  padding: 0;
  background-color: #fff;
  vertical-align: top;
  border: 1px solid ${cardBorderColor};
  .inner {
    padding: 1rem;
  }
  .card-row + .card-row {
    border-top: 1px solid ${cardBorderColor};
  }
  .link {
    display: block;
    color: ${textPrimaryColor};
  }
  .link:hover {
    text-decoration: none;
    color: inherited;
    background-color: #fff7eb;
    color: #000;
  }
`

Card.Header = styled.div`
  padding: 0.5rem 1rem;
  font-size: 1em;
  border-bottom: 1px solid #ccc;
  .counter,
  .comment {
    color: rgba(255, 255, 255, 0.7);
  }
  .big {
    font-size: 1.5rem;
  }
`

Card.Body = styled.div``

Card.Section = styled.div`
  padding: 1em;
  &:not(:first-child) {
    border-top: 1px dashed ${cardBorderColor};
  }
`

export default Card
