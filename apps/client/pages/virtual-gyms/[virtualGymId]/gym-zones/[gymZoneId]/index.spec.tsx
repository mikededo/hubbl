import { useRouter } from 'next/router';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { AppProvider } from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, render } from '@testing-library/react';

import GymZone from './index';

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

  return {
    ...actual,
    useAppContext: app
  };
});

const virtualGymResponse = {
  data: {
    id: 1,
    name: 'VirtualGymName'
  }
};

const gymZoneResponse = {
  data: {
    id: 1,
    name: 'GymZoneName',
    openTime: '09:00:00',
    closeTime: '21:00:00',
    calendar: 1
  }
};

const renderPage = () =>
  render(
    <AppProvider>
      <GymZone />
    </AppProvider>
  );

describe('Gym zone page', () => {
  const fetcher = jest.fn();

  const swrSpy = jest.spyOn(swr, 'default');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2022/04/04'));

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { gym: { id: 1 } },
      token: { parsed: {} },
      todayEvents: [],
      API: { fetcher }
    } as any);
    swrSpy.mockClear().mockImplementation((key) => {
      if (key === '/virtual-gyms/1') {
        return virtualGymResponse as any;
      } else if (key === '/virtual-gyms/1/gym-zones/2') {
        return gymZoneResponse as any;
      }

      return {} as any;
    });
  });

  it('should render successfully', () => {
    const { baseElement } = renderPage();

    expect(baseElement).toBeTruthy();
  });

  it('should have the getLayout prop defined', () => {
    expect(GymZone.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {GymZone.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: undefined },
      todayEvents: [],
      helpers: { hasAccess: () => false },
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should push to 404 on virtualGym fetch error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(() => ({ error: 'Some error' } as any));

    await act(async () => {
      renderPage();
    });

    expect(useRouter().push).toHaveBeenCalledTimes(1);
    expect(useRouter().push).toHaveBeenCalledWith('/404');
  });

  it('should push to 404 on gymZone fetch error', async () => {
    swrSpy.mockClear().mockImplementation((key) => {
      if (key === '/virtual-gyms/1') {
        return virtualGymResponse as any;
      } else if (key === '/virtual-gyms/1/gym-zones/2') {
        return { error: 'Some error' } as any;
      }

      return {} as any;
    });

    await act(async () => {
      renderPage();
    });

    expect(useRouter().push).toHaveBeenCalledTimes(1);
    expect(useRouter().push).toHaveBeenCalledWith('/404');
  });
});
