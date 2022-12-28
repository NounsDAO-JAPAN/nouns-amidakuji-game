import React, { useCallback } from 'react';
import styled from 'styled-components';
import { zeroAddr } from '../../utils/constants';
import toShortAddress from '../../utils/toShortAddress';
import BidButton from '../BidButton';
import { Amidakuji } from '../../../gen/types';
import { useEthers } from '@usedapp/core';
import useAmidakujiResult from '../../hooks/useAmidakujiResult';

type Props = {
  result?: Amidakuji.ResultGameStructOutput;
};

export const Result = ({ result }: Props) => {
  const { mintItem } = useAmidakujiResult();
  const { account } = useEthers();
  const winner =
    result && result?.winner !== zeroAddr
      ? toShortAddress(result.winner)
      : 'NONE';

  const onMint = useCallback(() => {
    if (result) {
      mintItem(result.id.toNumber());
    }
  }, [mintItem, result]);

  return (
    <Wrapper>
      <StyledResult>
        <dt>Winner:</dt>
        <dd>{winner}</dd>
      </StyledResult>
      {result?.winner === account && (
        <BidButton className="mint" onClick={onMint}>
          MINT SBT
        </BidButton>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 1em;
  padding-bottom: 1em;

  .mint {
    flex: 1 1 auto;

    @media (min-width: 992px) {
      flex: 0 0 auto;
    }
  }
`;
const StyledResult = styled.dl`
  display: flex;
  flex: 1 1 auto;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;

  dd {
    margin-left: 0.5rem;
  }
`;

export default Result;
