import type { NextPage } from 'next';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { Col, Container, Row } from 'react-bootstrap';
import useCurrentAmidakuji from '../src/hooks/useCurrentAmidakuji';
import dayjs from 'dayjs';
import NavBar from '../src/components/NavBar';
import { useMemo } from 'react';
import { useEthers } from '@usedapp/core';
import { useRouter } from 'next/router';
import Arrows from '../src/components/Arrows';
import Time from '../src/components/Time';
import GameTitle from '../src/components/GameTitle';
import GameInfo from '../src/components/GameInfo';
import Activity from '../src/components/Activity';
import Entry from '../src/components/Entry';
import Draw from '../src/components/Draw';
import { WrappedProgress } from '../src/components/Progress';
import { useRecoilState } from 'recoil';
import { transactionState } from '../src/state/transactionState';
import Footer from '../src/components/Footer';
import numberToPosition from '../src/utils/numberToPosition';

const Home: NextPage = () => {
  const { account } = useEthers();
  const router = useRouter();
  const { game, isHeld } = useCurrentAmidakuji();
  const [tState] = useRecoilState(transactionState);

  const canEntry = useMemo(() => {
    if (!game || !account) return false;
    if (!isHeld) return true;
    if (game.players.includes(account)) return false;
    if (game.players.length === 6) return false;
    const now = dayjs();
    if (dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0)
      return false;
    return game.players.length !== 6;
  }, [game, account, isHeld]);

  const canDraw = useMemo(() => {
    if (!game || !account) return false;
    if (!isHeld) return false;
    if (!game.players.includes(account)) return false;
    return !canEntry && (game.myLinesX?.filter((l) => l !== 0).length ?? 0) < 2;
  }, [account, canEntry, game, isHeld]);

  return (
    <>
      <WrappedProgress
        isProgress={tState.state === 'Mining' || tState.state === 'Success'}
        transaction={tState.transaction?.hash}
        wrapper={{ width: '100vw', height: '100vh', fixed: true, zIndex: 100 }}
      />
      <Container style={{ marginBottom: 32 }}>
        <NavBar />
        <Row>
          <Col lg={6}>
            <div>
              <Image src="/sample.svg" alt="" width="100%" />
            </div>
            {isHeld && game?.myLinesX?.[0] !== 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <span>The lines you drew are </span>
                <span>
                  {game?.myLinesX
                    .filter((x) => x !== 0)
                    .map((l, i) => (
                      <span key={i}>
                        [X:{numberToPosition(l)} to {numberToPosition(l + 1)},
                        Y:{game?.myLinesY[i]}]{' '}
                      </span>
                    ))}
                </span>
              </div>
            )}
          </Col>
          <Col>
            <Row>
              <Col>
                <Arrows
                  leftProps={{
                    onClick: () => {
                      if (game && game.id.toNumber() >= 1) {
                        if (isHeld) {
                          router.push(`/game/${game.id.toNumber() - 1}`);
                        } else {
                          router.push(`/game/${game.id.toNumber()}`);
                        }
                      }
                    },
                  }}
                  rightProps={{
                    onClick: () => {},
                    disabled: true,
                  }}
                />
                {game && !isHeld && (
                  <Time
                    time={dayjs
                      .unix(game.startTime.toNumber())
                      .add(1, 'day')
                      .format('YYYY-MM-DD HH:mm:ss')}
                  >
                    {dayjs
                      .unix(game.startTime.toNumber())
                      .add(1, 'day')
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </Time>
                )}
              </Col>
            </Row>
            <Row>
              <GameTitle>
                Amida #
                {game &&
                  (isHeld ? game?.id.toNumber() : game?.id.toNumber() + 1)}
              </GameTitle>
            </Row>
            {canEntry && (
              <Row>
                <Entry isHeld={isHeld} />
              </Row>
            )}
            {isHeld && (
              <>
                <Row>
                  <GameInfo game={game} />
                </Row>
                <Row>
                  {game && (
                    <Activity
                      game={{
                        players: game.players,
                        playerNames: game.playerNames,
                        playerPositions: game.playerPositions,
                      }}
                    />
                  )}
                </Row>
                {canDraw && (
                  <Row>
                    <Draw />
                  </Row>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
