import { ChainId } from '@usedapp/core';

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Hardhat;
// |ChainId.Mainnet  | ChainId.Goerli;

interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (
  bucket: CacheBucket,
  ...parts: (string | number)[]
) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const CHAIN_ID: SupportedChains = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? '31337'
);

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri:
      'http://localhost:8000/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
};

const config = {
  app: app[CHAIN_ID],
  addresses: '',
};

export default config;

// TODO
export const amidakujiContractAddr =
  '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1';
export const amidakujiSBTContractAddr =
  '0x59b670e9fA9D0A427751Af201D676719a970857b';
