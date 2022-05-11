import { act } from 'react-dom/test-utils';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { AppPalette } from '@hubbl/shared/types';
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
    ],
    gymZones: [
      { id: 1, name: 'GymZonesOne' },
      { id: 2, name: 'GymZonesTwo' },
      { id: 3, name: 'GymZonesThree' }
    ]
  },
  error: null
};

const todayEvents = [
  {
    id: 1,
    name: 'EventOne',
    eventType: { id: 1, labelColor: AppPalette.BLUE }
  },
  {
    id: 2,
    name: 'EventTwo',
    eventType: { id: 1, labelColor: AppPalette.BLUE }
  },
  {
    id: 3,
    name: 'EventThree',
    eventType: { id: 1, labelColor: AppPalette.BLUE }
  }
];

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
      todayEvents,
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError,
      onSuccess
    });
    swrSpy.mockReturnValue(response as any);
  });

  const successfulRender = async () => {
    await act(async () => {
      renderPage();
    });

    expect(screen.getByText('Virtual gyms'.toUpperCase())).toBeInTheDocument();
    response.data.virtualGyms.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
    expect(screen.getByText('Gym zones'.toUpperCase())).toBeInTheDocument();
    response.data.gymZones.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
    todayEvents.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    // Check api calls
    expect(swrSpy).toHaveBeenCalledTimes(1);
    expect(swrSpy).toHaveBeenCalledWith('/dashboards/1', fetcher, {
      revalidateOnFocus: false
    });
  };

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
      todayEvents,
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render properly, if gym is a number', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: 1 },
      todayEvents,
      API: { fetcher }
    } as any);

    successfulRender();
  });

  it('should render properly, if gym is a gym object', async () => {
    successfulRender();
  });

  it('should call onError if fetch fails', async () => {
    swrSpy.mockImplementation(() => ({ error: 'Error thrown' } as any));

    await act(async () => {
      renderPage();
    });

    // Check api calls
    expect(swrSpy).toHaveBeenCalledTimes(1);
    expect(swrSpy).toHaveBeenCalledWith('/dashboards/1', fetcher, {
      revalidateOnFocus: false
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });
});
