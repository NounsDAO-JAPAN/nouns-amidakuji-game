import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { Amidakuji } from '../../../gen/types';
import dayjs from 'dayjs';

type Props = {
  game?: Amidakuji.PublicGameStructOutput | Amidakuji.ResultGameStructOutput;
};

export const GameInfo = ({ game }: Props) => {
  return (
    <Row>
      <GameInfoCol lg={5}>
        <dl>
          <dt>Participants count</dt>
          <dd>{game?.players.length}</dd>
        </dl>
      </GameInfoCol>
      <GameInfoCol lg={6}>
        <dl>
          <dt>Participation ends at</dt>
          <dd>
            {game &&
              dayjs.unix(game.endTime.toNumber()).format('YYYY-MM-DD HH:mm:ss')}
          </dd>
        </dl>
      </GameInfoCol>
    </Row>
  );
};

const GameInfoCol = styled(Col)`
  font-weight: 700;

  @media (min-width: 992px) {
    border-right: 1px solid #79809c49;
  }

  & + & {
    border: none;

    @media (min-width: 992px) {
      padding-left: 2.5em;
    }
  }

  dt {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--brand-cool-light-text);
  }

  dd {
    font-size: 1.5rem;
    font-family: 'PT Root UI';
    color: var(--brand-cool-dark-text);
  }
`;

export default GameInfo;
