import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from '../src/styles';
import type { AppProps } from 'next/app';
import { ChainId, DAppProvider, MulticallAddresses } from '@usedapp/core';
import { multicallOnLocalhost } from '../src/config';

const supportedChainURLs = {
  // [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
  // [ChainId.Rinkeby]: createNetworkHttpUrl('rinkeby'),
  [ChainId.Hardhat]: 'http://localhost:8545',
  // [ChainId.Goerli]: createNetworkHttpUrl('goerli'),
};

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: ChainId.Hardhat,
  readOnlyUrls: {
    [ChainId.Hardhat]: 'http://localhost:8545',
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DAppProvider config={useDappConfig}>
        <GlobalStyles />
        <Component {...pageProps} />
      </DAppProvider>
    </>
  );
}

export default MyApp;
