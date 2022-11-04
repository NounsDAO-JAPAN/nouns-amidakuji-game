import { ChainId } from '@usedapp/core';

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
}

type SupportedChains = ChainId.Hardhat | ChainId.Goerli;
// |ChainId.Mainnet;

export const CHAIN_ID: SupportedChains = parseInt(
  // process.env.REACT_APP_CHAIN_ID ?? '31337'
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

// TODO
export const amidakujiContractAddr =
  '0x5B5be8b74f78f13aB568483b732Db29497629F8b';
export const amidakujiSBTContractAddr =
  '0xCEDA107cD2766833c29e7FB8d861f2Fb511251df';
