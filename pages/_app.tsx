import { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/glow.css';
import '@/styles/starry.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (
        <Component {...pageProps} />
  );
}

export default MyApp;
