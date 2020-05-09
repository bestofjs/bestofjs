import styled from 'styled-components'

const Card = styled.div`
  flex: 1;
  padding: 0;
  background-color: #fff;
  border: 1px solid var(--boxBorderColor);
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
  .name {
    font-size: 1.3em;
  }
  .inner {
    padding: 1rem;
    border-top: 1px dashed var(--boxBorderColor);
    color: var(--textSecondaryColor);
  }
  .icon {
    color: var(--iconColor);
    margin-right: 5px;
  }
  .github-data {
    margin-top: 0.2em;
  }
`

export default Card
