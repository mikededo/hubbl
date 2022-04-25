import '../styles/styles.css';

import type { ReactElement, ReactNode } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import {
  AppProvider,
  LoadingContext,
  ThemeProvider,
  ToastContext
} from '@hubbl/data-access/contexts';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type LayoutAppProps = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: LayoutAppProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Welcome to Hubbl!</title>
      </Head>

      <LoadingContext>
        <ThemeProvider>
          <ToastContext>
            <AppProvider>
              {/* TODO: Add auth guard */}
              {getLayout(<Component {...pageProps} />)}
            </AppProvider>
          </ToastContext>
        </ThemeProvider>
      </LoadingContext>
    </>
  );
};

export default App;
