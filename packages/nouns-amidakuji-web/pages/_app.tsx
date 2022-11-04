import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from '../src/styles';
import type { AppProps } from 'next/app';
import { ChainId, DAppProvider } from '@usedapp/core';

const useDappConfig = {
  // readOnlyChainId: ChainId.Hardhat,
  readOnlyChainId: ChainId.Goerli,
  readOnlyUrls: {
    // [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Goerli]:
      'https://goerli.infura.io/v3/948608d585514a4e8f3faf6b29e21fda',
    // [ChainId.Mainnet]: 'http://localhost:8545',
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
