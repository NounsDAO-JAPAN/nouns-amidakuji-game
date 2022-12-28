import React, { useCallback, useMemo, useState } from 'react';
import { Form, Row } from 'react-bootstrap';
import BidButton from '../BidButton';
import useCurrentAmidakuji from '../../hooks/useCurrentAmidakuji';
import styled from 'styled-components';

const numToPos = (num: number) => {
  switch (num) {
    case 1:
      return 'A';
    case 2:
      return 'B';
    case 3:
      return 'C';
    case 4:
      return 'D';
    case 5:
      return 'E';
    case 6:
      return 'F';
  }
};

const Draw: React.FC<{}> = ({}) => {
  const { draw } = useCurrentAmidakuji();

  const [x1, setX1] = useState<number>();
  const [y1, setY1] = useState<number>();

  const [x2, setX2] = useState<number>();
  const [y2, setY2] = useState<number>();

  const onDraw = useCallback(() => {
    if (draw && x1 && y1 && x2 && y2) {
      draw(x1, y1, x2, y2);
    }
  }, [draw, x1, y1, x2, y2]);

  const canDrawButton = useMemo(() => {
    return (x1 ?? 0) > 0 && (y1 ?? 0) > 0 && (x2 ?? 0) > 0 && (y2 ?? 0) > 0;
  }, [x1, x2, y1, y2]);

  return (
    <div>
      <FormRow>
        <div style={{ maxWidth: 'none', width: 'auto' }}>
          <div style={{ display: 'flex' }}>
            <Form.Select
              onChange={(e) => setX1(parseInt(e.target.value))}
              style={{
                width: 160,
                marginLeft: 4,
                borderRadius: 10,
                fontWeight: 'bold',
              }}
              size="lg"
            >
              <option value="0">POS X1</option>
              {[1, 2, 3, 4, 5].map((i) => (
                <option value={i} key={i}>
                  {numToPos(i)}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              onChange={(e) => setY1(parseInt(e.target.value))}
              style={{
                width: 160,
                marginLeft: 4,
                borderRadius: 10,
                fontWeight: 'bold',
              }}
              size="lg"
            >
              <option value="0">POS Y1</option>
              {x1 &&
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                  .filter((i) => (x1 % 2 === 0 ? i % 2 === 0 : i % 2 === 1))
                  .map((i) => (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  ))}
            </Form.Select>
          </div>
          <div style={{ display: 'flex', marginTop: 4 }}>
            <Form.Select
              onChange={(e) => setX2(parseInt(e.target.value))}
              style={{
                width: 160,
                marginLeft: 4,
                borderRadius: 10,
                fontWeight: 'bold',
              }}
              size="lg"
            >
              <option value="0">POS X2</option>
              {[1, 2, 3, 4, 5].map((i) => (
                <option value={i} key={i}>
                  {numToPos(i)}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              onChange={(e) => setY2(parseInt(e.target.value))}
              style={{
                width: 160,
                marginLeft: 4,
                borderRadius: 10,
                fontWeight: 'bold',
              }}
              size="lg"
            >
              <option value="0">POS Y2</option>
              {x2 &&
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                  .filter((i) => (x2 % 2 === 0 ? i % 2 === 0 : i % 2 === 1))
                  .map((i) => (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  ))}
            </Form.Select>
          </div>
        </div>
        <BidButton onClick={onDraw} disabled={!canDrawButton}>
          Draw
        </BidButton>
      </FormRow>
    </div>
  );
};

export default Draw;

const FormRow = styled(Row)`
  display: flex;
  justify-content: flex-start;
  margin: 1rem 0 1rem;

  > * {
    flex: 1 auto;

    @media (min-width: 992px) {
      flex: 0 auto;
    }
  }
`;
