import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
  time: string;
};

export const Time = ({ children, time }: Props) => {
  return <StyledTime data-time={time}>{children}</StyledTime>;
};

const StyledTime = styled.time`
  font-family: 'PT Root UI';
  font-weight: bold;
  margin-left: 1em;
  color: var(--brand-cool-light-text);
`;

export default Time;
