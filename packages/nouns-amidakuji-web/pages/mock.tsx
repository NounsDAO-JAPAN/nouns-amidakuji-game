import NavBar from '../src/components/NavBar';
import Image from '../src/components/Image';
import Arrows from '../src/components/Arrows';
import Time from '../src/components/Time';
import GameTitle from '../src/components/GameTitle';
import Entry from '../src/components/Entry';
import GameInfo from '../src/components/GameInfo';
import { Col, Container, Row } from 'react-bootstrap';
import Activity from '../src/components/Activity';
import Result from '../src/components/Result';
import TransactionLink from '../src/components/TransactionLink';

const Mock = () => {
  // dummy
  let image = './sample.png';
  const mintState = { transaction: { hash: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' } }
  const drawState = { transaction: { hash: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' } }

  return (
    <>
      <Container>
        <NavBar />

        <Row>
          <Col lg={6}>
            <Image src={image} alt="" />
          </Col>
          <Col>
            <Row>
              <Col>
                <Arrows
                  leftProps={{
                    onClick: () => {},
                    disabled: true,
                  }}
                  rightProps={{
                    onClick: () => {},
                  }}
                />
                <Time time="2022-11-04 09:27:00">2022-11-04 09:27:00</Time>
              </Col>
            </Row>
            <Row>
              <GameTitle>Amida #1</GameTitle>
            </Row>
            <Row>
              <Entry />
            </Row>
            <Row>
              <GameInfo game={{}} />
            </Row>
            <Row>
              <Activity
                game={{
                  players: [
                    '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                  ],
                  playerNames: ['AAA', 'BBB'],
                  playerPositions: [1, 3],
                }}
              />
            </Row>
            <Row>
              <Result
                result={{
                  winner: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                }}
              />
            </Row>
            {mintState?.transaction && (
              <Row>
                <TransactionLink href={`https://goerli.etherscan.io/tx/${mintState?.transaction.hash}`}>
                  {mintState?.transaction.hash}
                </TransactionLink>
              </Row>
            )}
            {drawState?.transaction && (
              <Row>
                <TransactionLink href={`https://goerli.etherscan.io/tx/${drawState?.transaction.hash}`}>
                  {drawState?.transaction.hash}
                </TransactionLink>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Mock;
