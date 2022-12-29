import { ChainId } from '@usedapp/core';

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
}

type SupportedChains = ChainId.Hardhat | ChainId.Goerli;

export const CHAIN_ID: SupportedChains = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? '5'
);

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
  },
  [ChainId.Goerli]: {
    jsonRpcUri: 'https://goerli.infura.io/v3/948608d585514a4e8f3faf6b29e21fda',
    wsRpcUri: 'wss://goerli.infura.io/ws/v3/948608d585514a4e8f3faf6b29e21fda',
  },
};

const config = {
  app: app[CHAIN_ID],
  addresses: '',
};

export default config;

export const amidakujiContractAddr =
  '0x2343298601946aAbB2b53Ba4ad62AcaD84c17924';
export const amidakujiSBTContractAddr =
  '0xacbFD67993443fa2cC5B6A60e68f48ffE785609c';
