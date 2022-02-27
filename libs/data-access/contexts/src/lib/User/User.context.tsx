import React, { createContext, memo, useContext } from 'react';
import { UserContextValue, useUserContextValue } from './Context';

const UserContext = createContext({} as UserContextValue);
UserContext.displayName = 'UserContext';

const useUserContext = () => useContext(UserContext);

type UserContextProps = { children: React.ReactNode };

const UserProvider = ({ children }: UserContextProps): JSX.Element => {
  const value = useUserContextValue();

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const memoizedProvider = memo(UserProvider);

export { memoizedProvider as UserContext, useUserContext };
