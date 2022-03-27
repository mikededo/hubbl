import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, render, screen } from '@testing-library/react';

import Events from './index';

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
jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken');

  return { ...actual, decode: jest.fn() };
});

const eventTypesResponse = {
  data: [
    {
      id: 1,
      name: 'One',
      description: 'Event type one description',
      labelColor: AppPalette.EMERALD
    },
    {
      id: 2,
      name: 'Two',
      description: 'Event type two description',
      labelColor: AppPalette.INDIGO
    },
    {
      id: 3,
      name: 'Three',
      description: 'Event type three description',
      labelColor: AppPalette.PURPLE
    },
    {
      id: 4,
      name: 'Four',
      description: 'Event type four description',
      labelColor: AppPalette.ORANGE
    },
    {
      id: 5,
      name: 'Five',
      description: 'Event type five description',
      labelColor: AppPalette.PINK
    }
  ]
};

const renderPage = () =>
  render(
    <AppProvider>
      <LoadingContext>
        <ThemeProvider theme={createTheme()}>
          <ToastContext>
            <Events />
          </ToastContext>
        </ThemeProvider>
      </LoadingContext>
    </AppProvider>
  );

describe('Events page', () => {
  const fetcher = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    const pop = jest.fn();
    const push = jest.fn();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    });
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
    (ctx.useLoadingContext as jest.Mock).mockReturnValue({
      loading: false,
      onPopLoading: pop,
      onPushLoading: push
    });
  });

  it('should have the getLayout prop defined', () => {
    expect(Events.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Events.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render the list of event types', async () => {
    swrSpy.mockImplementation(() => eventTypesResponse as any);

    await act(async () => {
      renderPage();
    });

    expect(screen.getByText('Event types')).toBeInTheDocument();
    eventTypesResponse.data.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    expect(screen.getByTitle('add-event-type')).toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
      token: { parsed: undefined },
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should call onError if fetching event types fails', async () => {
    swrSpy.mockImplementation(() => ({ error: 'Error thrown' } as any));

    await act(async () => {
      renderPage();
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });

  it("should call onPopLoading if data has been fetched and it's loading", async () => {
    swrSpy.mockImplementation(() => ({ data: [] } as any));
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
