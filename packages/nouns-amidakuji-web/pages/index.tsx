import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'react-bootstrap/Image';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import NavBar from '../src/components/NavBar';

const Home: NextPage = () => {
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
                  <ActivityRow>Mock Data</ActivityRow>
                </InformationRow>
                <ActivityRow>
                  {/*<Col lg={12}>*/}
                  {/*  <BidCollection className={auctionBidClasses.bidCollection}>*/}
                  {/*    <li*/}
                  {/*      className={*/}
                  {/*        (isCool*/}
                  {/*          ? `${auctionBidClasses.bidRowCool}`*/}
                  {/*          : `${auctionBidClasses.bidRowWarm}`) +*/}
                  {/*        ` ${nounContentClasses.bidRow}`*/}
                  {/*      }*/}
                  {/*    >*/}
                  {/*      <Trans>All Noun auction proceeds are sent to the</Trans>{' '}*/}
                  {/*      <Link to="/vote" className={nounContentClasses.link}>*/}
                  {/*        <Trans>Nouns DAO</Trans>*/}
                  {/*      </Link>*/}
                  {/*      .{' '}*/}
                  {/*      <Trans>*/}
                  {/*        For this reason, we, the project's founders*/}
                  {/*        (‘Nounders’) have chosen to compensate ourselves with*/}
                  {/*        Nouns. Every 10th Noun for the first 5 years of the*/}
                  {/*        project will be sent to our multisig (5/10), where it*/}
                  {/*        will be vested and distributed to individual Nounders.*/}
                  {/*      </Trans>*/}
                  {/*    </li>*/}
                  {/*  </BidCollection>*/}
                  {/*  <div*/}
                  {/*    className={*/}
                  {/*      isCool*/}
                  {/*        ? bidBtnClasses.bidHistoryWrapperCool*/}
                  {/*        : bidBtnClasses.bidHistoryWrapperWarm*/}
                  {/*    }*/}
                  {/*  >*/}
                  {/*    <Link*/}
                  {/*      to="/nounders"*/}
                  {/*      className={*/}
                  {/*        isCool*/}
                  {/*          ? bidBtnClasses.bidHistoryCool*/}
                  {/*          : bidBtnClasses.bidHistoryWarm*/}
                  {/*      }*/}
                  {/*    >*/}
                  {/*      <Trans>Learn more</Trans> →*/}
                  {/*    </Link>*/}
                  {/*  </div>*/}
                  {/*</Col>*/}
                </ActivityRow>
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
                  ONE NOUN,
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
