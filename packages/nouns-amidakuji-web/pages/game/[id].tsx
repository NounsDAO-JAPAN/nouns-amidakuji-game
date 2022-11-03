import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'react-bootstrap/Image';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import NavBar from '../../src/components/NavBar';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAmidakujiResult from '../../src/hooks/useAmidakujiResult';
import { useEthers } from '@usedapp/core';

const Id: NextPage = () => {
  const router = useRouter();
  const { account } = useEthers();
  const [id, setId] = useState<string>();
  const { result, image, mintItem } = useAmidakujiResult(parseInt(id || ''));

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setId(id as string);
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      <Head>
        <title>Nouns Amidakuji</title>
        <meta name="description" content="Nouns Amidakuji" />
        <link
          rel="icon"
          href="/packages/nouns-amidakuji-web/public/favicon.ico"
        />
      </Head>
      <Wrapper>
        <Container fluid="xl">
          <NavBar />
          <Row>
            <NounContentCol lg={{ span: 6 }}>
              <NounWrapper>
                <ImageWrapper>
                  <NounImage src={image || ''} alt={''} fluid />
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
                          # {result?.id.toNumber()}
                        </h1>
                      </AuctionActivityNounTitle>
                    </Col>
                  </ActivityRow>
                  <ActivityRow>
                    players:
                    {result?.players.map((p) => (
                      <div key={p}>{p}</div>
                    ))}
                  </ActivityRow>
                  <ActivityRow>
                    playerNames:
                    {result?.playerNames.map((p) => (
                      <div key={p}>{p}</div>
                    ))}
                  </ActivityRow>
                  <ActivityRow>winner: {result?.winner}</ActivityRow>
                  <ActivityRow>
                    {result?.winner === account && id && mintItem && (
                      <button onClick={() => mintItem(id)}>MINT</button>
                    )}
                  </ActivityRow>
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
