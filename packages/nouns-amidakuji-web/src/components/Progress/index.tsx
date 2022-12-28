import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import TransactionLink from '../TransactionLink';

type ProgressProps = {
  isProgress: boolean;
  size?: string;
  baseColor?: string;
  accentColor?: string;
  borderWidth?: string;
  loopTime?: string;
};

const Progress = ({
  isProgress = true,
  size = '50px',
  baseColor = '#fff',
  accentColor = '#f3322c',
  borderWidth = '4px',
  loopTime = '0.7s',
}: ProgressProps) => {
  return isProgress ? (
    <_Progress
      size={size}
      baseColor={baseColor}
      accentColor={accentColor}
      borderWidth={borderWidth}
      loopTime={loopTime}
    />
  ) : null;
};

type WrappedProgressProps = ProgressProps & {
  transaction?: string;
  wrapper: {
    width: string;
    height: string;
    fixed?: boolean;
    zIndex?: number;
  };
};

export const WrappedProgress = ({
  wrapper,
  isProgress,
  transaction,
  ...props
}: WrappedProgressProps) => {
  return isProgress ? (
    <Wrapper wrapper={wrapper}>
      <Progress {...props} isProgress />
      {transaction && (
        <TransactionLink href={`https://polygonscan.com/tx/${transaction}`}>
          {transaction}
        </TransactionLink>
      )}
    </Wrapper>
  ) : null;
};

const rotate = keyframes`
  0% {
    rotate: 0;
  }
  100% {
    rotate: 360deg;
  }
`;

const _Progress = styled.div<Omit<ProgressProps, 'isProgress'>>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  border: solid ${(props) => props.borderWidth} ${(props) => props.baseColor};
  border-top-color: ${(props) => props.accentColor};
  border-left-color: ${(props) => props.accentColor};
  animation: ${rotate} ${(props) => props.loopTime} infinite linear;
`;
const Wrapper = styled.div<Pick<WrappedProgressProps, 'wrapper'>>`
  ${(props) => {
    if (props.wrapper.fixed) {
      return `
        position: fixed;
        top: 0;
        left: 0;
      `;
    }
  }}
  ${(props) => {
    if (props.wrapper.zIndex !== undefined) {
      return `z-index: ${props.wrapper.zIndex};`;
    }
  }}
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: ${(props) => props.wrapper.width};
  height: ${(props) => props.wrapper.height};
  background: rgba(0, 0, 0, 0.5);
`;

export default Progress;
