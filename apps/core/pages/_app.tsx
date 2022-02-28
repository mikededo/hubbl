import '../styles/styles.css';

import { AppProps } from 'next/app';
import Head from 'next/head';

import {
  ThemeProvider,
  ToastContext,
  UserProvider
} from '@hubbl/data-access/contexts';

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Welcome to core!</title>
    </Head>

    <ThemeProvider>
      {/* TODO: Add user context */}
      <ToastContext>
        <UserProvider>
          {/* TODO: Add auth guard */}
          <Component {...pageProps} />
        </UserProvider>
      </ToastContext>
    </ThemeProvider>
  </>
);

export default CustomApp;
