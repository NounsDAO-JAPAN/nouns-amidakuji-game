import React from 'react';
import styled from 'styled-components';
import { zeroAddr } from '../../utils/constants';
import toShortAddress from '../../utils/toShortAddress';
import BidButton from '../BidButton';

type Props = any;

export const Result = ({ result }: Props) => {
  const winner = result.winner !== zeroAddr ? toShortAddress(result.winner) : 'NONE';

  return <Wrapper>
    <StyledResult>
      <dt>Winner:</dt>
      <dd>{winner}</dd>
    </StyledResult>
    <BidButton className="mint" onClick={() => {}}>MINT SBT</BidButton>
  </Wrapper>
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
`
const StyledResult = styled.dl`
  display: flex;
  flex: 1 1 auto;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;

  dd {
    margin-left: 0.5rem;
  }
`

export default Result;