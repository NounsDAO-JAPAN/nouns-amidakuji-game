import { ChainId } from '@usedapp/core';

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
}

type SupportedChains = ChainId.Hardhat | ChainId.Polygon;

export const CHAIN_ID: SupportedChains = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? '137'
);

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
  },
  [ChainId.Polygon]: {
    jsonRpcUri:
      'https://polygon-mainnet.infura.io/v3/948608d585514a4e8f3faf6b29e21fda',
    wsRpcUri:
      'wss://polygon-mainnet.infura.io/v3/948608d585514a4e8f3faf6b29e21fda',
  },
};

const config = {
  app: app[CHAIN_ID],
  addresses: '',
};

export default config;

export const amidakujiContractAddr =
  '0x43033b9E040C44cFd03836903A53003E458e7A34';
export const amidakujiSBTContractAddr =
  '0xc5931bcca5c9DAda4c5BFA71A0F3bAd5973d72Ca';
