import '../styles/styles.css';

import { AppProps } from 'next/app';
import Head from 'next/head';

import {
  ThemeProvider,
  ToastContext,
  AppProvider
} from '@hubbl/data-access/contexts';

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Welcome to core!</title>
    </Head>

    <ThemeProvider>
      {/* TODO: Add user context */}
      <ToastContext>
        <AppProvider>
          {/* TODO: Add auth guard */}
          <Component {...pageProps} />
        </AppProvider>
      </ToastContext>
    </ThemeProvider>
  </>
);

export default CustomApp;
