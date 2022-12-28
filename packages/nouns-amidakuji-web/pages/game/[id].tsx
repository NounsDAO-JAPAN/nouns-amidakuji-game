import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import Image from 'react-bootstrap/Image';
import { Col, Container, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import NavBar from '../../src/components/NavBar';
import { useState } from 'react';
import useAmidakujiResult from '../../src/hooks/useAmidakujiResult';
import { useRouter } from 'next/router';
import Arrows from '../../src/components/Arrows';
import Time from '../../src/components/Time';
import GameTitle from '../../src/components/GameTitle';
import Result from '../../src/components/Result';
import GameInfo from '../../src/components/GameInfo';
import Activity from '../../src/components/Activity';
import { WrappedProgress } from '../../src/components/Progress';
import { useRecoilState } from 'recoil';
import { transactionState } from '../../src/state/transactionState';
import Footer from '../../src/components/Footer';
import numberToPosition from '../../src/utils/numberToPosition';

const Id: NextPage = () => {
  const router = useRouter();
  const [id, setId] = useState<string>();
  const { image, result, currentGameId } = useAmidakujiResult(
    (id && parseInt(id)) || undefined
  );
  const [tState] = useRecoilState(transactionState);

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setId(id as string);
    }
  }, [router.isReady, router.query]);

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
              <Image src={image || '/sample.png'} alt="" width="100%" />
            </div>
            {result?.myLinesX?.[0] !== 0 && (
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
                  {result?.myLinesX
                    .filter((x) => x !== 0)
                    .map((l, i) => (
                      <span key={i}>
                        [X:{numberToPosition(l)} to {numberToPosition(l + 1)},
                        Y:{result?.myLinesY[i]}]{' '}
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
                    onClick: () =>
                      id &&
                      parseInt(id) > 1 &&
                      router.push(`/game/${parseInt(id) - 1}`),
                    disabled: parseInt(id || '1') <= 1,
                  }}
                  rightProps={{
                    onClick: () => {
                      if (
                        id &&
                        currentGameId &&
                        currentGameId === parseInt(id)
                      ) {
                        router.push(`/`);
                      } else {
                        router.push(`/game/${parseInt(id || '0') + 1}`);
                      }
                    },
                  }}
                />
                {result && (
                  <Time
                    time={dayjs
                      .unix(result.startTime.toNumber())
                      .format('YYYY-MM-DD HH:mm:ss')}
                  >
                    {dayjs
                      .unix(result.startTime.toNumber())
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </Time>
                )}
              </Col>
            </Row>
            <Row>
              <GameTitle>Amida #{result && result?.id.toNumber()}</GameTitle>
            </Row>
            <Row>
              <GameInfo game={result} />
            </Row>
            <Row>
              {result && (
                <Activity
                  game={{
                    players: result.players,
                    playerNames: result.playerNames,
                    playerPositions: result.playerPositions,
                  }}
                />
              )}
            </Row>
            <Row>
              <Result result={result} />
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Id;
