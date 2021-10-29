import React from "react";
import styled from "@emotion/styled";

export const Section = (props) => <section {...props} />;

Section.Header = ({ children, icon }) => {
  return (
    <Row>
      {icon && <IconCell>{icon}</IconCell>}
      <MainCell>{children}</MainCell>
    </Row>
  );
};

Section.Title = styled.h2`
  font-size: 1.5rem;
`;

Section.SubTitle = styled.div`
  font-size: 1rem;
  color: var(--textSecondaryColor);
  text-transform: uppercase;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

const IconCell = styled.div`
  padding-right: 0.5rem;
  color: var(--iconColor);
`;

const MainCell = styled.div`
  flex-grow: 1;
`;
