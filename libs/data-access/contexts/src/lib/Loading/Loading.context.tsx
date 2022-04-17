import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useState
} from 'react';

import { AnimatePresence } from 'framer-motion';

import { EmptyHandler } from '@hubbl/shared/types';
import { LinearProgress, styled } from '@mui/material';

type LoadingContextProps = { children: React.ReactNode };

type LoadingContextValue = {
  loading: boolean;
  onPushLoading: EmptyHandler;
  onPopLoading: EmptyHandler;
};

const FixedLinearProgress = styled(LinearProgress)({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  zIndex: 1000
});

const LoadingContext = createContext<LoadingContextValue>(
  {} as LoadingContextValue
);
LoadingContext.displayName = 'LoadingContext';

const useLoadingContext = () => useContext(LoadingContext);

const LoadingProvider = ({ children }: LoadingContextProps): JSX.Element => {
  const [loading, setLoading] = useState<number>(0);

  const onPushLoading = useCallback(() => {
    setLoading((prev) => prev + 1);
  }, []);

  const onPopLoading = useCallback(() => {
    setLoading((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <LoadingContext.Provider
      value={{ onPushLoading, onPopLoading, loading: !!loading }}
    >
      <AnimatePresence>{loading && <FixedLinearProgress />}</AnimatePresence>

      {children}
    </LoadingContext.Provider>
  );
};

const memoizedProvider = memo(LoadingProvider);

export { memoizedProvider as LoadingContext, useLoadingContext };
