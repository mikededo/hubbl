import '../styles/styles.css';

import type { ReactElement, ReactNode } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type LayoutAppProps = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: LayoutAppProps) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Welcome to core!</title>
      </Head>

      <LoadingContext>
        <ToastContext>
          <AppProvider>
            {/* TODO: Add auth guard */}
            {getLayout(<Component {...pageProps} />)}
          </AppProvider>
        </ToastContext>
      </LoadingContext>
    </>
  );
};

export default App;
