import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
};

export const GameTitle = ({
  children,
  ...props
}: Props) => {
  return <Title {...props}>{children}</Title>
};

const Title = styled.h1`
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  font-size: var(--game-title);
  font-family: "Londrina Solid";
  color: var(--brand-cool-dark-text);

  @media (min-width: 992px) {
    font-size: var(--game-title-lg);
  }
`;

export default GameTitle;