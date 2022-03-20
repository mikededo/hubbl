import React, { createContext, memo, useContext, useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { EmptyHandler } from '@hubbl/shared/types';
import { LinearProgress, styled } from '@mui/material';

type LoadingContextProps = { children: React.ReactNode };

type LoadingContextValue = {
  onPushLoading: EmptyHandler;
  onPopLoading: EmptyHandler;
};

const FixedLinearProgress = styled(LinearProgress)({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0
});

const LoadingContext = createContext<LoadingContextValue>(
  {} as LoadingContextValue
);
LoadingContext.displayName = 'LoadingContext';

const useLoadingContext = () => useContext(LoadingContext);

const ToastProvider = ({ children }: LoadingContextProps): JSX.Element => {
  const [loading, setLoading] = useState<number>(0);

  const onPushLoading = () => {
    setLoading((prev) => prev + 1);
  };

  const onPopLoading = () => {
    setLoading((prev) => Math.min(0, prev - 1));
  };

  return (
    <LoadingContext.Provider value={{ onPushLoading, onPopLoading }}>
      <AnimatePresence>{loading && <FixedLinearProgress />}</AnimatePresence>

      {children}
    </LoadingContext.Provider>
  );
};

const memoizedProvider = memo(ToastProvider);

export { memoizedProvider as LoadingContext, useLoadingContext };
