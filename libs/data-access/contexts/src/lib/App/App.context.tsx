import React, { createContext, memo, useContext } from 'react';

import { UserContextValue, useAppContextValue } from './Context';

const UserContext = createContext({} as UserContextValue);
UserContext.displayName = 'UserContext';

const useAppContext = () => useContext(UserContext);

type UserContextProps = { children: React.ReactNode };

const AppProvider = ({ children }: UserContextProps): JSX.Element => {
  const value = useAppContextValue();

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const memoizedProvider = memo(AppProvider);

export { memoizedProvider as AppProvider, useAppContext };
