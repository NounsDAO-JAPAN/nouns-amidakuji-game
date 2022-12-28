import React from 'react';
import styled from 'styled-components';

type ArrowProps = {
  arrow?: 'left' | 'right';
  disabled?: boolean;
  onClick: (e: any) => any;
};

export const Arrow = (props: ArrowProps) => {
  return (
    <StyledArrow {...props}>{props.arrow === 'left' ? '←' : '→'}</StyledArrow>
  );
};

type Props = {
  leftProps: ArrowProps;
  rightProps: ArrowProps;
};
export const Arrows = ({ leftProps, rightProps }: Props) => {
  return (
    <>
      <Arrow arrow="left" {...leftProps} />
      <Arrow arrow="right" {...rightProps} />
    </>
  );
};

const StyledArrow = styled.button<ArrowProps>`
  position: relative;
  -webkit-appearance: none;
  padding: 0;
  margin-left: 0.3rem;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: none;
  background-size: contain;
  background-repeat: no-repeat;
  color: rgba(0, 0, 0, 0);
  background-color: var(--brand-cool-accent);
  border-radius: 50%;
  font-weight: 700;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-top: 2px solid;
    ${(props) => `border-${props.arrow}: 2px solid;`}
    ${(props) => `transform:
      translate(-50%, -50%)
      rotate(${props.arrow === 'left' ? -45 : 45}deg);`}
    border-color: var(--brand-cool-dark-text);
    content: '';
  }

  @media (hover: hover) {
    ${({ disabled }) =>
      !disabled &&
      `
      transition: box-shadow 0.15s ease;

      &:hover {
        box-shadow: 0 0 0 2px var(--brand-cool-dark-text);
      }
      `
    }
  }
`;

export default Arrows;
