import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useState
} from 'react';

import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';

type ToastContextProps = { children: React.ReactNode };

type ToastContextStateItem = { value: string | null; visible: boolean };

type ToastContextState = {
  error: ToastContextStateItem;
  info: ToastContextStateItem;
  success: ToastContextStateItem;
};

type ToastContextValue = {
  onError: (value: string) => void;
  onInfo: (value: string) => void;
  onSuccess: (value: string) => void;
};

const ToastContext = createContext<ToastContextValue>({} as ToastContextValue);
ToastContext.displayName = 'ToastContext';

const useToastContext = () => useContext(ToastContext);

const TransitionUp = (props: Omit<SlideProps, 'direction'>) => (
  <Slide direction="left" {...props} />
);

const ToastProvider = ({ children }: ToastContextProps): JSX.Element => {
  const [state, setState] = useState<ToastContextState>({
    error: { value: null, visible: false },
    info: { value: null, visible: false },
    success: { value: null, visible: false }
  });

  const onError = useCallback((message: string) => {
    setState((prev) => ({
      error: { visible: true, value: message },
      info: { ...prev.info, visible: false },
      success: { ...prev.success, visible: false }
    }));
  }, []);

  const onInfo = useCallback((message: string) => {
    setState((prev) => ({
      error: { ...prev.error, visible: false },
      info: { visible: true, value: message },
      success: { ...prev.success, visible: false }
    }));
  }, []);

  const onSuccess = useCallback((message: string) => {
    setState((prev) => ({
      error: { ...prev.error, visible: false },
      info: { ...prev.info, visible: false },
      success: { visible: true, value: message }
    }));
  }, []);

  const handleOnHide = useCallback(() => {
    setState((prev) => ({
      error: { ...prev.error, visible: false },
      info: { ...prev.info, visible: false },
      success: { ...prev.success, visible: false }
    }));
  }, []);

  return (
    <>
      <ToastContext.Provider value={{ onError, onInfo, onSuccess }}>
        {children}
      </ToastContext.Provider>

      <Snackbar open={state.error.visible} TransitionComponent={TransitionUp}>
        <Alert severity="error" onClose={handleOnHide}>
          {state.error.value}
        </Alert>
      </Snackbar>

      <Snackbar open={state.info.visible} TransitionComponent={TransitionUp}>
        <Alert severity="info" onClose={handleOnHide}>
          {state.info.value}
        </Alert>
      </Snackbar>

      <Snackbar open={state.success.visible} TransitionComponent={TransitionUp}>
        <Alert severity="success" onClose={handleOnHide}>
          {state.success.value}
        </Alert>
      </Snackbar>
    </>
  );
};

const memoizedProvider = memo(ToastProvider);

export { memoizedProvider as ToastContext, useToastContext };
