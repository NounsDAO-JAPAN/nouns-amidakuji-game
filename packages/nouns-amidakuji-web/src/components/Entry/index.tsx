import React from 'react';
import { Button, Form, FormControl, Row } from 'react-bootstrap';
import styled from 'styled-components';
import TransactionLink from '../TransactionLink';
import numberToPosition from '../../utils/numberToPosition';
import BidButton from '../BidButton';
import toShortAddress from '../../utils/toShortAddress';

type Props = any;

export const Entry = (props: Props) => {
  return (
    <div>
      <h2>Entry to new games!</h2>
      <FormRow>
        <BidInput
          type="text"
          onChange={(e: any) => { }}
          placeholder="Name(Max 3 char)"
          maxLength={3}
        />
        <Select
          onChange={(e: any) => { }}
          size="lg"
        >
          <option value="0">POS</option>
          {[1, 2, 3, 4, 5, 6]
            // .filter((i) => !game?.playerPositions.includes(i) || isNew)
            .map((i) => (
              <option value={i} key={i}>
                {numberToPosition(i)}
              </option>
            ))}
        </Select>
        <BidButton onClick={() => { }} disabled>
          Entry
        </BidButton>
      </FormRow>
      <TransactionRow>
        <TransactionLink href="#">{'0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'}</TransactionLink>
      </TransactionRow>
    </div>
  );
};

const FormRow = styled(Row)`
  margin: 1rem 0 0;

  > * {
    flex: 1 1 auto;

    @media (min-width: 992px) {
      flex: 0 0 auto;
    }
  }
`;

const TransactionRow = styled(Row)`
  margin-top: 0.5em;
`;

const Select = styled(Form.Select)`
  width: 100px;
  margin-left: 0.25em;
  border-radius: 10px;
  font-weight: 700;
`

const BidInput = styled(FormControl)`
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 240px;
  height: 54px;
  color: black;
  border-radius: 12px !important;
  box-shadow: inset 0px 0px 0px 1px #fff;
  background-color: white;
  outline: none !important;
  box-shadow: none !important;
  font-family: 'PT Root UI';
  font-weight: bold;
  font-size: 25px;
  transition: all 0.2s ease-in-out;
  border: none;

  :focus {
    box-shadow: inset 0px 0px 0px 1px var(--brand-cool-dark-text) !important;
  }
`;

export default Entry;