import React, { createContext, useContext } from 'react';

import { useAppContextValue } from './Context';
import { AppContextValue } from './types';

const AppContext = createContext({} as AppContextValue);
AppContext.displayName = 'AppContext';

const useAppContext = () => useContext(AppContext);

type AppContextProps = { children: React.ReactNode };

const AppProvider = ({ children }: AppContextProps): JSX.Element => {
  const value = useAppContextValue();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppProvider, useAppContext };
export type { AppContextValue };
