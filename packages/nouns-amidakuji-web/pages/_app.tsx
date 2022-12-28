import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from '../src/styles';
import type { AppProps } from 'next/app';
import { ChainId, DAppProvider, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';
import React, { useEffect } from 'react';

const myNetworks = [...DEFAULT_SUPPORTED_CHAINS];
const polygon = myNetworks.find((chain) => chain.chainId === ChainId.Polygon);

const useDappConfig = {
  // readOnlyChainId: ChainId.Hardhat,
  // readOnlyChainId: ChainId.Goerli,
  readOnlyChainId: ChainId.Polygon,
  readOnlyUrls: {
    // [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Polygon]:
      'https://polygon-mainnet.infura.io/v3/948608d585514a4e8f3faf6b29e21fda',
    // [ChainId.Mainnet]: 'http://localhost:8545',
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (polygon) {
      polygon.rpcUrl = 'https://polygon-rpc.com/';
    }
  }, []);

  return (
    <RecoilRoot>
      <Head>
        <title>Nouns Amidakuji</title>
        <meta
          name="description"
          content="It is a full-on chain game called Nouns Amidakuji."
        />
        <link rel="icon" href="/logo.svg" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="application-name" content="Nouns Amidakuji" />
        <meta
          name="description"
          content="It is a full-on chain game called Nouns Amidakuji."
        />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta
          property="og:url"
          content="https://nouns-amidakuji-game.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nouns Amidakuji" />
        <meta
          property="og:image"
          content="https://nouns-amidakuji-game.vercel.app/sample.png"
        />
        <meta
          property="og:description"
          content="It is a full-on chain game called Nouns Amidakuji."
        />
        <meta property="og:site_name" content="Nouns Amidakuji" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://nouns-amidakuji-game.vercel.app/"
        />
        <meta name="twitter:title" content="Nouns Amidakuji" />
        <meta
          name="twitter:description"
          content="It is a full-on chain game called Nouns Amidakuji."
        />
        <meta
          name="twitter:image"
          content="https://nouns-amidakuji-game.vercel.app/sample.png"
        />
      </Head>
      <DAppProvider config={useDappConfig}>
        <GlobalStyles />
        <Component {...pageProps} />
      </DAppProvider>
    </RecoilRoot>
  );
}

export default MyApp;
