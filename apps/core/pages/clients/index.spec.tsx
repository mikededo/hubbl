import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Clients from './index';

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

const clients = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Client-${i}`,
    lastName: `Test-${i}`,
    email: `client-${i}@test.com`,
    phone: `${i}`.repeat(9),
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER']
  }));

const clientsTwo = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Client-Two-${i}`,
    lastName: `Test-${i}`,
    email: `client-${i}@test.com`,
    phone: `${i}`.repeat(9),
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER']
  }));

describe('Clients page', () => {
  const mutateSpy = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');

  const fetcher = jest.fn();
  const poster = jest.fn();
  const putter = jest.fn();

  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1 } },
      todayEvents: [],
      API: { fetcher, poster, putter }
    });
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError,
      onSuccess
    });
    swrSpy.mockImplementation((key) => {
      if (key === '/persons/clients?skip=0') {
        return { data: clients, mutate: mutateSpy } as any;
      } else if (key === '/persons/clients?skip=15') {
        return { data: clientsTwo } as any;
      }

      return {} as any;
    });
  });

  it('should have the getLayout prop defined', () => {
    expect(Clients.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Clients.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
      token: { parsed: undefined },
      todayEvents: [],
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      render(<Clients />);
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render properly', async () => {
    await act(async () => {
      render(<Clients />);
    });

    // Clients list
    clients.forEach((client) => {
      expect(screen.getByText(client.firstName)).toBeInTheDocument();
    });
    // Pagination
    expect(screen.getByLabelText('prev-page')).toBeInTheDocument();
    expect(screen.getByLabelText('next-page')).toBeInTheDocument();
  });

  it('it should iterate through the pages', async () => {
    await act(async () => {
      render(<Clients />);
    });
    clients.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-page'));
    });
    clientsTwo.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('prev-page'));
    });
    clients.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });
  });
});
