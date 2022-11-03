import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from '../src/styles';
import type { AppProps } from 'next/app';
import { ChainId, DAppProvider } from '@usedapp/core';

const useDappConfig = {
  readOnlyChainId: ChainId.Hardhat,
  readOnlyUrls: {
    [ChainId.Hardhat]: 'http://localhost:8545',
    // [ChainId.Mainnet]: 'http://localhost:8545',
    // [ChainId.Goerli]: 'http://localhost:8545',
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
