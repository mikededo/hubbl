import { useRouter } from 'next/router';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { AppProvider } from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, render, screen } from '@testing-library/react';

import VirtualGym from './index';

jest.mock('next/router', () => {
  const result = {
    route: '/',
    pathname: '',
    query: { virtualGymId: 1, gymZoneId: 2 },
    asPath: '',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn() },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null)
  };

  return {
    useRouter() {
      return result;
    }
  };
});

jest.mock('@hubbl/data-access/api');
jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();
  const toast = jest.fn();
  const load = jest.fn();

  return {
    ...actual,
    useAppContext: app,
    useToastContext: toast,
    useLoadingContext: load
  };
});

const virtualGymResponse = {
  data: {
    id: 1,
    name: 'VirtualGymOne',
    gymZones: [
      { id: 1, name: 'GymZoneOne', isClassType: false },
      { id: 2, name: 'GymZoneTwo', isClassType: true },
      { id: 3, name: 'GymZoneThree', isClassType: true },
      { id: 4, name: 'GymZoneFour', isClassType: false },
      { id: 5, name: 'GymZoneFive', isClassType: false },
      { id: 6, name: 'GymZoneSix', isClassType: true }
    ]
  },
  error: null
};

describe('Virtual gym page', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();

  const swrSpy = jest.spyOn(swr, 'default');

  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { gym: { id: 1 } },
      token: { parsed: {} },
      todayEvents: [],
      API: { fetcher, poster }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError
    });
    swrSpy.mockImplementation((key) => {
      if (key === '/virtual-gyms/1') {
        return { ...virtualGymResponse } as any;
      }

      return {};
    });
  });

  it('should have the getLayout prop defined', () => {
    expect(VirtualGym.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {VirtualGym.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: undefined },
      todayEvents: [],
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      render(
        <AppProvider>
          <VirtualGym />
        </AppProvider>
      );
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render the list of virtual gyms', async () => {
    await act(async () => {
      render(
        <AppProvider>
          <VirtualGym />
        </AppProvider>
      );
    });

    // Find gym zones
    virtualGymResponse.data.gymZones.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
  });

  it('should call onError if fetcher returns an error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(
        () => ({ data: undefined, error: 'Data error' } as any)
      );

    await act(async () => {
      render(
        <AppProvider>
          <VirtualGym />
        </AppProvider>
      );
    });

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Data error');
  });

  it('should push to 404 on virtualGym fetch error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(() => ({ error: 'Error thrown' } as any));

    await act(async () => {
      render(
        <AppProvider>
          <VirtualGym />
        </AppProvider>
      );
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown')
    expect(useRouter().push).toHaveBeenCalledTimes(1);
    expect(useRouter().push).toHaveBeenCalledWith('/404');
  });
});
