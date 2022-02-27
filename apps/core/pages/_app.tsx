import '../styles/styles.css';

import { AppProps } from 'next/app';
import Head from 'next/head';

import { ThemeContext, ToastContext } from '@hubbl/data-access/contexts';

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Welcome to core!</title>
    </Head>

    <ThemeContext>
      {/* TODO: Add user context */}
      <ToastContext>
      {/* TODO: Add auth guard */}
      <Component {...pageProps} />
      </ToastContext>
    </ThemeContext>
  </>
);

export default CustomApp;
