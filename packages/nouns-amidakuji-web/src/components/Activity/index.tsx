import React from 'react';
import styled from 'styled-components';
import toShortAddress from '../../utils/toShortAddress';
import numberToPosition from '../../utils/numberToPosition';

type Props = any;

export const Activity = ({ game }: Props) => {
  return (
    <List>
      {game?.players.map((p: string, i: number) => (
        <ListItem key={p}>
          <ShortAddress>
            {toShortAddress(p)} ({game.playerNames[i]}:{' '}
            {numberToPosition(game.playerPositions[i])})
          </ShortAddress>
        </ListItem>
      ))}
    </List>
  );
};

const List = styled.ul`
  list-style: none;

  @media (min-width: 992px) {
    padding: 0;
  }
`;

const ListItem = styled.li`
  padding: 0.8em;
  border-bottom: 1px solid var(--brand-cool-border);
`;

const ShortAddress = styled.div`
  font-size: 1.1rem;
  font-family: 'PT Root UI';
  font-weight: 700;
`;

export default Activity;
