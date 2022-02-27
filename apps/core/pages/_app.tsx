import '../styles/styles.css';

import { AppProps } from 'next/app';
import Head from 'next/head';

import { ThemeContext, ToastContext, UserContext } from '@hubbl/data-access/contexts';

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Welcome to core!</title>
    </Head>

    <ThemeContext>
      {/* TODO: Add user context */}
      <ToastContext>
        <UserContext>
          {/* TODO: Add auth guard */}
          <Component {...pageProps} />
        </UserContext>
      </ToastContext>
    </ThemeContext>
  </>
);

export default CustomApp;
