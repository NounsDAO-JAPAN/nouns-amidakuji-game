import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from '../src/styles';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
