import React, { createContext, useContext } from 'react';
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
  // If used insde the function, it throws an error and page does not load
  const value = useAppContextValue({ onPopLoading, onPushLoading });

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
