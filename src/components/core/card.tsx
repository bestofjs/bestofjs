import styled from "@emotion/styled";

export const Card = styled.div`
  margin-bottom: 2rem;
  border-radius: 4px;
  padding: 0;
  background-color: var(--cardBackgroundColor);
  vertical-align: top;
  border: 1px solid var(--boxBorderColor);
  .inner {
    padding: 1rem;
  }
  .card-row + .card-row {
    border-top: 1px solid var(--boxBorderColor);
  }
  .link {
    display: block;
    color: var(--textPrimaryColor);
  }
  .link:hover {
    text-decoration: none;
    color: inherited;
    background-color: #fff7eb;
    color: #000;
  }
`;

export const CardHeader = styled.div`
  padding: 1rem;
  font-size: 1rem;
  border-bottom: 1px solid var(--boxBorderColor);
  font-family: var(--headingFontFamily);
  .counter,
  .comment {
    color: rgba(255, 255, 255, 0.7);
  }
  .big {
    font-size: 1.5rem;
  }
  display: flex;
  align-items: center;
  .icon {
    margin-right: 0.5rem;
  }
`;

export const CardBody = styled.div``;

export const CardSection = styled.div`
  padding: 1em;
  &:not(:first-of-type) {
    border-top: 1px dashed var(--boxBorderColor);
  }
`;

export const CardFooter = styled.div`
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--boxBorderColor);
`;
