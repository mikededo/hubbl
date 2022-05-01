import { act } from 'react-dom/test-utils';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';

import Dashboard from './index';

jest.mock('@hubbl/data-access/api');
jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();
  const toast = jest.fn();

  return {
    ...actual,
    useAppContext: app,
    useToastContext: toast
  };
});
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    useMediaQuery: jest.fn(() => false)
  };
});

const response = {
  data: {
    virtualGyms: [
      { id: 1, name: 'VirtualGymOne' },
      { id: 2, name: 'VirtualGymTwo' },
      { id: 3, name: 'VirtualGymThree' }
    ]
  },
  error: null
};

const renderPage = () =>
  render(
    <AppProvider>
      <LoadingContext>
        <ToastContext>
          <Dashboard />
        </ToastContext>
      </LoadingContext>
    </AppProvider>
  );

describe('Dashboard page', () => {
  const fetcher = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1 } },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError,
      onSuccess
    });
    swrSpy.mockReturnValue(response as any);
  });

  it('should have the getLayout prop defined', () => {
    expect(Dashboard.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Dashboard.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: undefined },
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render properly, with the list of virtual gyms', async () => {
    await act(async () => {
      renderPage();
    });

    expect(screen.getByText('Virtual gyms'.toUpperCase())).toBeInTheDocument();
    response.data.virtualGyms.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });

    // Check api calls
    expect(swrSpy).toHaveBeenCalledTimes(1);
    expect(swrSpy).toHaveBeenCalledWith('/dashboards/1', fetcher, {
      revalidateOnFocus: false
    });
  });
});
