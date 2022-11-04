import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'react-bootstrap/Image';
import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';
import styled from 'styled-components';
import dayjs from 'dayjs';
import NavBar from '../../src/components/NavBar';
import { useCallback, useState } from 'react';
import { useEthers } from '@usedapp/core';
import useAmidakujiResult from '../../src/hooks/useAmidakujiResult';
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
const zeroAddr = '0x0000000000000000000000000000000000000000';

const Id: NextPage = () => {
  const { account } = useEthers();
  const router = useRouter();
  const [id, setId] = useState<string>();
  const { image, result, mintItem, mintState, currentGameId } =
    useAmidakujiResult((id && parseInt(id)) || undefined);

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setId(id as string);
    }
  }, [router.isReady, router.query]);

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
                {result?.myLinesX?.[0] !== 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    <span>The lines you drew are </span>
                    {result?.myLinesX
                      .filter((x) => x !== 0)
                      .map((l, i) => (
                        <span key={i}>
                          [X:{l} to {l + 1}, Y:{result?.myLinesY[i]}]{' '}
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
                            id &&
                            parseInt(id) > 1 &&
                            router.push(`/game/${parseInt(id) - 1}`)
                          }
                        >
                          ←
                        </Arrow>
                        <Arrow
                          onClick={() => {
                            if (
                              id &&
                              currentGameId &&
                              currentGameId - 1 === parseInt(id)
                            ) {
                              router.push(`/`);
                            } else {
                              router.push(`/game/${parseInt(id || '0') + 1}`);
                            }
                          }}
                        >
                          →
                        </Arrow>
                      </NavArrowsContainer>
                      <AuctionActivityDateHeadlineWrapper>
                        <AuctionActivityDateHeadlineDate>
                          {result &&
                            dayjs
                              .unix(result.startTime.toNumber())
                              .format('YYYY-MM-DD HH:mm:ss')}
                        </AuctionActivityDateHeadlineDate>
                      </AuctionActivityDateHeadlineWrapper>
                    </AuctionTitleAndNavWrapper>
                    <Col lg={12}>
                      <AuctionActivityNounTitle>
                        <h1 style={{ color: 'var(--brand-cool-dark-text)' }}>
                          Amida #{result?.id.toNumber()}
                        </h1>
                      </AuctionActivityNounTitle>
                    </Col>
                  </ActivityRow>
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
                            {result?.players.length}
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
                                  {result &&
                                    dayjs
                                      .unix(result.endTime.toNumber())
                                      .format('YYYY-MM-DD HH:mm:ss')}
                                </span>
                              </div>
                            </h2>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                  </ActivityRow>
                  <ActivityRow>
                    <BidCollection>
                      {result?.players.map((p, i) => (
                        <li className="bidRowCool" key={p}>
                          <div className="bidItem">
                            <div className="leftSectionWrapper">
                              <div className="bidder">
                                <ShortAddress>
                                  {toShortAddress(p)} ({result.playerNames[i]}:{' '}
                                  {numToPos(result.playerPositions[i])})
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
                </InformationRow>
              </AuctionActivityWrapper>
            </AuctionActivityCol>
          </Row>
        </Container>
      </Wrapper>
    </div>
  );
};

export default Id;

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
  position: absolute;
`;

const AuctionActivityDateHeadlineWrapper = styled.div`
  margin-left: 5rem;
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
