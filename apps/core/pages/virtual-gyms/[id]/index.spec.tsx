import * as swr from 'swr';

import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import * as ctx from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, screen, render } from '@testing-library/react';

import VirtualGym from './index';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { id: 1 },
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

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

const response = {
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

const renderPage = () =>
  render(
    <AppProvider>
      <LoadingContext>
        <ThemeProvider theme={createTheme()}>
          <ToastContext>
            <VirtualGym />
          </ToastContext>
        </ThemeProvider>
      </LoadingContext>
    </AppProvider>
  );

describe('Virtual gym page', () => {
  const fetcher = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onErrorSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    const pop = jest.fn();
    const push = jest.fn();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError: onErrorSpy });
    (ctx.useLoadingContext as jest.Mock).mockReturnValue({
      loading: false,
      onPopLoading: pop,
      onPushLoading: push
    });
    swrSpy.mockImplementation(() => response as any);
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
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render the list of virtual gyms', async () => {
    await act(async () => {
      renderPage();
    });

    // Find gym zones
    response.data.gymZones.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
    // Find add buttons
    expect(screen.getAllByTitle('add-gym-zone').length).toBe(2);
  });

  it('should call onError if fetcher returns an error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(
        () => ({ data: undefined, error: 'Data error' } as any)
      );

    await act(async () => {
      renderPage();
    });

    expect(onErrorSpy).toHaveBeenCalled();
    expect(onErrorSpy).toHaveBeenCalledWith('Data error');
  });

  it("should call onPopLoading if data has been fetched and it's loading", async () => {
    const onPopLoadingSpy = jest.fn();
    (ctx.useLoadingContext as jest.Mock).mockReturnValue({
      onPopLoading: onPopLoadingSpy,
      loading: true
    });

    await act(async () => {
      renderPage();
    });

    expect(onPopLoadingSpy).toHaveBeenCalledTimes(1);
  });
});
