import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { AppProvider } from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, render, screen } from '@testing-library/react';

import VirtualGyms from './index';

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
jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken');

  return { ...actual, decode: jest.fn() };
});

const response = {
  data: [
    {
      id: 1,
      name: 'VirtualGymOne',
      gymZones: [
        { id: 1, name: 'GymZoneOne' },
        { id: 2, name: 'GymZoneTwo' },
        { id: 3, name: 'GymZoneThree' }
      ]
    },
    { id: 2, name: 'VirtualGymTwo', gymZones: [] },
    {
      id: 3,
      name: 'VirtualGymThree',
      gymZones: [{ id: 4, name: 'GymZoneFour' }]
    }
  ],
  error: null
};

describe('Virtual gyms page', () => {
  const swrSpy = jest.spyOn(swr, 'default');

  const fetcher = jest.fn();

  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: { user: 'client' } },
      user: { gym: { id: 1 } },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError
    });
  });

  it('should have the getLayout prop defined', () => {
    expect(VirtualGyms.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {VirtualGyms.getLayout(<div />)}
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
      render(
        <AppProvider>
          <VirtualGyms />
        </AppProvider>
      );
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render the list of virtual gyms and gym zones', async () => {
    swrSpy.mockImplementation(() => response as any);

    await act(async () => {
      render(
        <AppProvider>
          <VirtualGyms />
        </AppProvider>
      );
    });

    response.data.forEach(({ name, gymZones }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();

      gymZones.forEach(({ name }) => {
        expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
      });
    });
  });

  it('should call onError if fetch fails', async () => {
    swrSpy.mockImplementation(() => ({ error: 'Error thrown' } as any));

    await act(async () => {
      render(
        <AppProvider>
          <VirtualGyms />
        </AppProvider>
      );
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });
});
