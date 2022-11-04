import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import useCurrentAmidakuji from '../src/hooks/useCurrentAmidakuji';
import dayjs from 'dayjs';
import NavBar from '../src/components/NavBar';
import { useCallback, useMemo, useState } from 'react';
import { useEthers } from '@usedapp/core';
import useAmidakujiResult from '../src/hooks/useAmidakujiResult';
import { useRouter } from 'next/router';

const toShortAddress = (address: string) => {
  return address && [address.substr(0, 8), address.substr(34, 8)].join('...');
};

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

const Entry: React.FC<{ isNew?: boolean }> = ({ isNew = false }) => {
  const { game, entry, entryState } = useCurrentAmidakuji();
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
    <>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <BidInput
            type="text"
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Name(Max 3 char)"
            maxLength={3}
          />
          <Form.Select
            onChange={(e) => setPos(parseInt(e.target.value))}
            style={{
              width: 100,
              marginLeft: 4,
              borderRadius: 10,
              fontWeight: 'bold',
            }}
            size="lg"
          >
            <option value="0">POS</option>
            {[1, 2, 3, 4, 5, 6]
              .filter((i) => !game?.playerPositions.includes(i) || isNew)
              .map((i) => (
                <option value={i} key={i}>
                  {numToPos(i)}
                </option>
              ))}
          </Form.Select>
          <BidButton onClick={onEntry} disabled={!canEntryButton}>
            Entry
          </BidButton>
        </div>
        {entryState?.transaction && (
          <ActivityRow>
            Transaction Hash:
            <Link
              href={`https://goerli.etherscan.io/tx/${entryState?.transaction.hash}`}
              target="_blank"
            >
              <a target="_blank">
                {toShortAddress(entryState?.transaction.hash)}
              </a>
            </Link>
          </ActivityRow>
        )}
      </div>
    </>
  );
};

const zeroAddr = '0x0000000000000000000000000000000000000000';

const Home: NextPage = () => {
  const { account } = useEthers();
  const router = useRouter();
  const { game, draw, drawState } = useCurrentAmidakuji();
  const { image, result, mintItem, mintState } = useAmidakujiResult(
    game?.id.toNumber()
  );

  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();

  const onDraw = useCallback(() => {
    if (draw && x && y) {
      draw(x, y);
    }
  }, [draw, x, y]);

  const canEntry = useMemo(() => {
    if (!game || !account) return false;
    if (game.players.includes(account)) return false;
    const now = dayjs();
    if (dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0)
      return false;
    return game.players.length !== 6;
  }, [game, account]);

  const canDraw = useMemo(() => {
    if (!game) return false;
    const now = dayjs();
    if (dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0)
      return false;
    return !canEntry && (game.myLinesX?.filter((l) => l !== 0).length ?? 0) < 2;
  }, [canEntry, game]);

  const canDrawButton = useMemo(() => {
    return (x ?? 0) > 0 && (y ?? 0) > 0;
  }, [x, y]);

  const gameIsEnded = useMemo(() => {
    if (!game) return false;
    const now = dayjs();
    return dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0;
  }, [game]);

  const onMint = useCallback(() => {
    if (result) {
      mintItem(result.id.toNumber());
    }
  }, [mintItem, result]);

  return (
    <div>
      <Head>
        <title>Nouns Amidakuji</title>
        <meta name="description" content="Nouns Amidakuji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>
        <Container fluid="xl">
          <NavBar />
          <Row>
            <NounContentCol lg={{ span: 6 }}>
              <NounWrapper>
                <ImageWrapper>
                  <NounImage src={image || '/sample.png'} alt={''} fluid />
                </ImageWrapper>
                {game?.myLinesX?.[0] !== 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    <span>The lines you drew are </span>
                    {game?.myLinesX
                      .filter((x) => x !== 0)
                      .map((l, i) => (
                        <span key={i}>
                          [X:{l} to {l + 1}, Y:{game?.myLinesY[i]}]{' '}
                        </span>
                      ))}
                  </div>
                )}
              </NounWrapper>
            </NounContentCol>
            <AuctionActivityCol lg={{ span: 6 }}>
              <AuctionActivityWrapper>
                <InformationRow>
                  <ActivityRow>
                    <AuctionTitleAndNavWrapper lg={12}>
                      <NavArrowsContainer>
                        <Arrow
                          onClick={() =>
                            game &&
                            game.id.toNumber() > 1 &&
                            router.push(`/game/${game.id.toNumber() - 1}`)
                          }
                        >
                          ←
                        </Arrow>
                        <Arrow>→</Arrow>
                      </NavArrowsContainer>
                      <AuctionActivityDateHeadlineWrapper>
                        <AuctionActivityDateHeadlineDate>
                          {game &&
                            dayjs
                              .unix(game.startTime.toNumber())
                              .format('YYYY-MM-DD HH:mm:ss')}
                        </AuctionActivityDateHeadlineDate>
                      </AuctionActivityDateHeadlineWrapper>
                    </AuctionTitleAndNavWrapper>
                    <Col lg={12}>
                      <AuctionActivityNounTitle>
                        <h1 style={{ color: 'var(--brand-cool-dark-text)' }}>
                          Amida #{game?.id.toNumber()}
                        </h1>
                      </AuctionActivityNounTitle>
                    </Col>
                  </ActivityRow>
                  {gameIsEnded && (
                    <ActivityRow style={{ marginTop: 8, marginBottom: 32 }}>
                      <p style={{ fontWeight: 'bold' }}>NEW GAME</p>
                      <Entry isNew={true} />
                    </ActivityRow>
                  )}
                  <ActivityRow>
                    <Col lg={5} className="currentBidCol">
                      <Row className="wrapper-2 section-2">
                        <Col xs={5} lg={12} style={{ paddingLeft: '0.5rem' }}>
                          <h4
                            style={{
                              color: 'var(--brand-cool-light-text)',
                            }}
                          >
                            Participants count
                          </h4>
                        </Col>
                        <Col xs="auto" lg={12}>
                          <h2
                            style={{
                              color: 'var(--brand-cool-dark-text)',
                              marginRight: '0.5rem',
                            }}
                          >
                            {game?.players.length}
                          </h2>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} className="auctionTimerCol">
                      <Row className="wrapper-2 section-2">
                        <Row>
                          <Col xs={6} lg={12} style={{ marginTop: 1 }}>
                            <h4
                              style={{
                                color: 'var(--brand-cool-light-text)',
                              }}
                            >
                              Participation ends at
                            </h4>
                          </Col>
                          <Col xs="auto" lg={12}>
                            <h2
                              style={{
                                color: 'var(--brand-cool-dark-text)',
                                display: 'flex',
                                marginTop: 1,
                              }}
                            >
                              <div className="timerSection">
                                <span>
                                  {game &&
                                    dayjs
                                      .unix(game.endTime.toNumber())
                                      .format('YYYY-MM-DD HH:mm:ss')}
                                </span>
                              </div>
                            </h2>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                  </ActivityRow>
                  {canEntry && (
                    <ActivityRow>
                      <Entry />
                    </ActivityRow>
                  )}
                  {canDraw && (
                    <ActivityRow>
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <Form.Select
                            onChange={(e) => setX(parseInt(e.target.value))}
                            style={{
                              width: 160,
                              marginLeft: 4,
                              borderRadius: 10,
                              fontWeight: 'bold',
                            }}
                            size="lg"
                          >
                            <option value="0">POS X</option>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <option value={i} key={i}>
                                {numToPos(i)}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Select
                            onChange={(e) => setY(parseInt(e.target.value))}
                            style={{
                              width: 160,
                              marginLeft: 4,
                              borderRadius: 10,
                              fontWeight: 'bold',
                            }}
                            size="lg"
                          >
                            <option value="0">POS Y</option>
                            {x &&
                              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                                .filter((i) =>
                                  x % 2 === 0 ? i % 2 === 0 : i % 2 === 1
                                )
                                .map((i) => (
                                  <option value={i} key={i}>
                                    {i}
                                  </option>
                                ))}
                          </Form.Select>
                          <BidButton onClick={onDraw} disabled={!canDrawButton}>
                            Draw
                          </BidButton>
                        </div>
                      </div>
                    </ActivityRow>
                  )}
                  <ActivityRow>
                    <BidCollection>
                      {game?.players.map((p, i) => (
                        <li className="bidRowCool" key={p}>
                          <div className="bidItem">
                            <div className="leftSectionWrapper">
                              <div className="bidder">
                                <ShortAddress>
                                  {toShortAddress(p)} ({game.playerNames[i]}:{' '}
                                  {numToPos(game.playerPositions[i])})
                                </ShortAddress>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </BidCollection>
                  </ActivityRow>
                  {result && (
                    <ActivityRow
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', width: 280 }}>
                        Winner:{' '}
                        {result.winner !== zeroAddr
                          ? toShortAddress(result.winner)
                          : 'NONE'}
                      </span>
                      {result.winner === account && (
                        <BidButton onClick={onMint}>MINT SBT</BidButton>
                      )}
                      <br />
                    </ActivityRow>
                  )}
                  {mintState?.transaction && (
                    <ActivityRow>
                      Transaction Hash:
                      <Link
                        href={`https://goerli.etherscan.io/tx/${mintState?.transaction.hash}`}
                        target="_blank"
                      >
                        <a target="_blank">
                          {toShortAddress(mintState?.transaction.hash)}
                        </a>
                      </Link>
                    </ActivityRow>
                  )}
                  {drawState?.transaction && (
                    <ActivityRow>
                      Transaction Hash:
                      <Link
                        href={`https://goerli.etherscan.io/tx/${drawState?.transaction.hash}`}
                        target="_blank"
                      >
                        <a target="_blank">
                          {toShortAddress(drawState?.transaction.hash)}
                        </a>
                      </Link>
                    </ActivityRow>
                  )}
                </InformationRow>
              </AuctionActivityWrapper>
            </AuctionActivityCol>
          </Row>
        </Container>
      </Wrapper>
    </div>
  );
};

export default Home;

const Wrapper = styled.div`
  background-color: rgb(213, 215, 225);
`;
const NounWrapper = styled.div`
  align-self: flex-end;
  width: 100%;
`;

const NounContentCol = styled(Col)`
  display: flex;
`;

const ImageWrapper = styled.div`
  position: relative;
  padding-top: 100%;
  width: 100%;
  height: 0;
`;

const NounImage = styled(Image)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  vertical-align: middle;
`;

const AuctionActivityCol = styled(Col)`
  padding-right: 5rem;
  padding-bottom: 0rem;
  min-height: 520px;
`;

const AuctionActivityWrapper = styled.div`
  @media (max-width: 992px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const InformationRow = styled.div`
  margin-bottom: 0.5rem;
`;

const AuctionTitleAndNavWrapper = styled(Col)`
  display: flex;

  @media (max-width: 992px) {
    font-size: 2.75rem;
  }
`;

const ActivityRow = styled(Row)`
  margin-bottom: 0rem;

  .currentBidCol {
    border-right: 1px solid #79809c49;
    margin-left: 6px;
    margin-top: 6px;
    margin-bottom: 16px;
    font-weight: bold;

    .wrapper-2 {
      width: max-content;
    }

    .section-2 h4 {
      font-weight: bold;
      font-size: 18px;
    }
  }

  .auctionTimerCol {
    padding-left: 0rem;
    margin-bottom: 16px;

    .wrapper-2 {
      padding-left: 2.5rem;
      padding-right: 0rem;
      margin-top: 0.3rem;
      width: max-content;
    }

    .section-2 h4 {
      font-weight: bold;
      font-size: 18px;
    }
  }

  .timerSection span {
    font-family: 'PT Root UI';
    font-weight: bold;
    font-size: 24px;
  }

  .timerSection {
    margin-right: 0.5rem;
  }

  .timerSectionFinal {
    font-weight: bold;
    margin-right: 0rem;
  }
`;

const NavArrowsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AuctionActivityDateHeadlineWrapper = styled.div`
  width: auto;
`;

const AuctionActivityDateHeadlineDate = styled.h4`
  font-family: 'PT Root UI';
  font-weight: bold;
  font-size: 17px;
  line-height: 27px;
  margin-top: 0.22rem;
  margin-left: 8px;
  color: var(--brand-cool-light-text);
`;

const AuctionActivityNounTitle = styled.div`
  display: inline-block;

  h1 {
    font-family: 'Londrina Solid';
    font-size: 68px;
    margin-bottom: 10px;
  }

  @media (max-width: 992px) {
    h1 {
      font-size: 56px;
    }
  }
`;

const Arrow = styled.button`
  -webkit-appearance: none;
  padding: 0;
  margin-left: 0.3rem;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: none;
  background-size: contain;
  background-repeat: no-repeat;
  font-size: large;
  color: var(--brand-cool-dark-text);
  background-color: var(--brand-cool-accent);
  border-radius: 50%;
  font-weight: bold;
`;

const BidCollection = styled.ul`
  display: grid;
  text-align: start;
  list-style-type: none;
  row-gap: 0.5rem;
  padding: 0;
  margin-bottom: 8px;
  margin-top: 1rem;
  width: 360px;

  .bidRowCool {
    font-family: 'PT Root UI', sans-serif;
    padding: 0.8rem;
    border-bottom: 1px solid var(--brand-cool-border);
    font-size: 1.1rem;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
  }

  .bidRowCool a {
    color: var(--brand-color-blue) !important;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
  }

  .bidRowCool a:hover {
    filter: brightness(110%);
  }

  .bidRowCool .bidAmount {
    color: var(--brand-cool-dark-text);
  }

  .bidRowWarm .bidAmount {
    color: var(--brand-warm-dark-text);
  }

  .bidItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .leftSectionWrapper {
    display: flex;
    flex-direction: column;
  }

  .bidder {
    font-family: 'PT Root UI';
    font-weight: bold;
  }

  .bidder > div > div {
    font-family: 'PT Root UI';
    font-weight: bold;
    font-size: 18px;
  }

  .bidRowCool .bidder > div > div {
    color: var(--brand-cool-dark-text);
  }
`;

const ShortAddress = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 6px;
  align-items: center;

  > div {
    padding-top: -2px;
  }

  span {
    letter-spacing: 0.2px;
    font-family: 'PT Root UI';
    font-weight: bold;
  }
`;

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

const BidButton = styled(Button)`
  font-family: 'PT Root UI';
  border-radius: 12px !important;
  margin-left: 0.6rem !important;
  margin-top: 3px;
  width: auto;
  padding: 10px 16px;
  height: 3rem;
  color: white;
  border: transparent;
  background-color: var(--brand-black);
  font-weight: bold;
  letter-spacing: normal;
  font-size: 19px;
  transition: all 0.2s ease-in-out;

  :disabled {
    outline: none !important;
    box-shadow: none !important;
    cursor: not-allowed;
    background-color: gray !important;
  }
`;
