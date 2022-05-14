import React, { createContext, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useLoadingContext } from '../Loading';
import { ThemeProvider } from '../Theme';
import { useAppContextValue } from './Context';
import { AppContextValue } from './types';

const AppContext = createContext({} as AppContextValue);
AppContext.displayName = 'AppContext';

const useAppContext = () => useContext(AppContext);

type AppContextProps = { children: React.ReactNode };

const AppProvider = ({ children }: AppContextProps): JSX.Element => {
  const { onPopLoading, onPushLoading } = useLoadingContext();
  const router = useRouter();

  // If used insde the function, it throws an error and page does not load
  const value = useAppContextValue({ onPopLoading, onPushLoading });

  useEffect(() => {
    const handleOnStart = (url: string) => {
      if (url !== router.asPath) {
        onPushLoading();
      }
    };
    const handleOnStop = (url: string) => {
      if (url === router.asPath) {
        onPopLoading();
      }
    };

    router.events.on('routeChangeStart', handleOnStart);
    router.events.on('routeChangeComplete', handleOnStop);
    router.events.on('routeChangeError', handleOnStop);

    return () => {
      router.events.off('routeChangeStart', handleOnStart);
      router.events.off('routeChangeComplete', handleOnStop);
      router.events.off('routeChangeError', handleOnStop);
    };
  });

  return (
    <AppContext.Provider value={value}>
      <ThemeProvider primaryColor={value.user?.gym?.color}>
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
export type { AppContextValue };
