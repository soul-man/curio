import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';
import '@/styles/glow.css';
import '@/styles/starry.css';
import 'react-toastify/dist/ReactToastify.css';

const WalletProvider = dynamic(
  () => import('@/constant/context/WalletContext').then((mod) => mod.WalletProvider),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
