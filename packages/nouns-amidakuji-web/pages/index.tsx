import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'react-bootstrap/Image';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import NavBar from '../src/components/NavBar';
import { useCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber, Contract, utils } from 'ethers';
import { Amidakuji } from '../gen/types';
import AmidakujiAbi from '../src/abi/Amidakuji.json';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Game {
  id: BigNumber;
  startTime: BigNumber;
  drawingStartTime: BigNumber;
  endTime: BigNumber;
  players: string[];
}

function useLatestGame(contract: Contract, address?: string): Game | undefined {
  const [id, setId] = useState<BigNumber>();
  useEffect(() => {
    (contract as Amidakuji).currentGameId().then((id) => {
      setId(id);
    });
  }, [contract]);

  const { value, error } =
    useCall(address && id && { contract, method: 'game', args: [id] }) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }

  return { ...value?.[0] };
}

const Home: NextPage = () => {
  const { account, library: provider } = useEthers();

  const contract = useMemo(() => {
    const Interface = new utils.Interface(AmidakujiAbi.abi);
    return new Contract(
      '0x63fea6E447F120B8Faf85B53cdaD8348e645D80E',
      Interface,
      provider?.getSigner()
    ) as Amidakuji;
  }, [provider]);

  const game = useLatestGame(contract, account);
  const { send: entry } = useContractFunction(contract, 'entry');

  const onEntry = useCallback(
    async (pos: number) => {
      await entry(pos);
    },
    [entry]
  );

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
                  <NounImage src={'/sample.png'} alt={''} fluid />
                </ImageWrapper>
              </NounWrapper>
            </NounContentCol>
            <AuctionActivityCol lg={{ span: 6 }}>
              <AuctionActivityWrapper>
                <InformationRow>
                  <ActivityRow>
                    <AuctionTitleAndNavWrapper lg={12}>
                      <NavArrowsContainer>
                        <button>←</button>
                        <button>→</button>
                      </NavArrowsContainer>
                      <AuctionActivityDateHeadlineWrapper>
                        <AuctionActivityDateHeadlineDate>
                          October 12, 2022
                        </AuctionActivityDateHeadlineDate>
                      </AuctionActivityDateHeadlineWrapper>
                    </AuctionTitleAndNavWrapper>
                    <Col lg={12}>
                      <AuctionActivityNounTitle>
                        <h1 style={{ color: 'var(--brand-cool-dark-text)' }}>
                          #88
                        </h1>
                      </AuctionActivityNounTitle>
                    </Col>
                  </ActivityRow>
                  <ActivityRow>
                    <div>
                      <input type="text" />
                      <button onClick={() => onEntry(1)}>Entry</button>
                    </div>
                  </ActivityRow>
                  <ActivityRow>
                    <div>
                      <input type="text" />
                      <button onClick={() => onEntry(1)}>Draw</button>
                    </div>
                  </ActivityRow>
                  <ActivityRow>
                    <div>
                      <input type="text" />
                      <button onClick={() => onEntry(1)}>Reveal</button>
                    </div>
                  </ActivityRow>
                  <ActivityRow style={{ marginTop: 16 }}>
                    Current Game
                  </ActivityRow>
                  <ActivityRow>GameId: {game?.id?.toNumber()}</ActivityRow>
                  <ActivityRow>players: {game?.players?.join(',')}</ActivityRow>
                  <ActivityRow>
                    startTime: {game?.startTime?.toNumber()}
                  </ActivityRow>
                  <ActivityRow>
                    endTime: {game?.endTime?.toNumber()}
                  </ActivityRow>
                </InformationRow>
              </AuctionActivityWrapper>
            </AuctionActivityCol>
          </Row>
        </Container>
      </Wrapper>
      <BannerContainer>
        <Container fluid={'lg'}>
          <Row className="align-items-center">
            <Col lg={6}>
              <BannerWrapper>
                <h1>
                  ONE GAME,
                  <br />
                  EVERY DAY,
                  <br />
                  FOREVER.
                </h1>
              </BannerWrapper>
            </Col>
            <Col lg={6}>
              <div style={{ padding: '2rem' }}>
                <ImageWrapper>
                  <TutorialImg src={'/tutorial.png'} alt={''} fluid />
                </ImageWrapper>
              </div>
            </Col>
          </Row>
        </Container>
      </BannerContainer>
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

const BannerContainer = styled.div`
  padding: 2rem 0rem 0rem 0rem;
`;

const BannerWrapper = styled.div`
  h1 {
    font-family: 'Londrina Solid';
    font-size: 5rem;
  }

  @media (max-width: 992px) {
    padding: 2rem;

    h1 {
      font-size: 3.75rem;
    }
  }

  @media (min-width: 992px) {
    h1 {
      font-size: 6rem;
      margin-left: 2rem;
    }
  }
`;

const TutorialImg = styled(Image)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  position: absolute;
  top: 100px;
  left: 0;
  width: 100%;
  height: auto;
  vertical-align: middle;
`;
