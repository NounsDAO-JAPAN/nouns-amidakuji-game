import React, { useCallback, useMemo, useState } from 'react';
import { Form, FormControl, Row } from 'react-bootstrap';
import styled from 'styled-components';
import numberToPosition from '../../utils/numberToPosition';
import BidButton from '../BidButton';
import useCurrentAmidakuji from '../../hooks/useCurrentAmidakuji';

const Entry: React.FC<{ isHeld: boolean }> = ({ isHeld }) => {
  const { game, entry } = useCurrentAmidakuji();
  const [pos, setPos] = useState<number>();
  const [name, setName] = useState<string>('');

  const canEntryButton = useMemo(() => {
    return name.length > 0 && pos;
  }, [name.length, pos]);

  const onEntry = useCallback(() => {
    if (entry && pos && name) {
      entry(name, pos);
    }
  }, [entry, name, pos]);

  return (
    <div>
      {isHeld ? <h2>Entry to Amidakuji!</h2> : <h2>Entry to new Amidakuji!</h2>}
      <FormRow>
        <NameInput
          type="text"
          onChange={(e: any) => setName(e.target.value)}
          placeholder="Name(Max 3 char)"
          maxLength={3}
        />
        <Select
          onChange={(e: any) => setPos(parseInt(e.target.value))}
          size="lg"
        >
          <option value="0">POS</option>
          {[1, 2, 3, 4, 5, 6]
            .filter((i) => !game?.playerPositions.includes(i) || !isHeld)
            .map((i) => (
              <option value={i} key={i}>
                {numberToPosition(i)}
              </option>
            ))}
        </Select>
        <BidButton onClick={onEntry} disabled={!canEntryButton}>
          Entry
        </BidButton>
      </FormRow>
    </div>
  );
};

const FormRow = styled(Row)`
  margin: 1rem 0 1rem;

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
`;

const NameInput = styled(FormControl)`
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
