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
    password: `client-pwd-${i}`,
    phone: `${i}`.repeat(9),
    covidPassport: true,
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER']
  }));

const clientsTwo = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Client-Two-${i}`,
    lastName: `Test-${i}`,
    email: `client-${i}@test.com`,
    password: `client-pwd-${i}`,
    phone: `${i}`.repeat(9),
    covidPassport: true,
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
      user: { gym: { id: 1, code: 'AABBCCDD' } },
      todayEvents: [],
      helpers: { hasAccess: () => true },
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

  it('should not render the table add button if no permissions', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: { user: 'worker' } },
      user: { gym: { id: 1, code: 'AABBCCDD' } },
      todayEvents: [],
      helpers: { hasAccess: () => false },
      API: { fetcher }
    });

    await act(async () => {
      render(<Clients />);
    });

    // Clients list
    clients.forEach((client) => {
      expect(screen.getByText(client.firstName)).toBeInTheDocument();
    });
    // Pagination
    expect(screen.queryByTitle('add-worker')).not.toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
      token: { parsed: undefined },
      todayEvents: [],
      helpers: { hasAccess: () => false },
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
    clients.forEach((client) => {
      expect(screen.getByText(client.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-page'));
    });
    clientsTwo.forEach((client) => {
      expect(screen.getByText(client.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('prev-page'));
    });
    clients.forEach((client) => {
      expect(screen.getByText(client.firstName)).toBeInTheDocument();
    });
  });

  describe('post client', () => {
    const fillClient = async () => {
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-client'));
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'Test' }
        });
        fireEvent.input(screen.getByPlaceholderText('Doe'), {
          target: { name: 'lastName', value: 'Client' }
        });
        fireEvent.input(screen.getByPlaceholderText('john@doe.com'), {
          target: { name: 'email', value: 'test@client.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '123 123 123' }
        });
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Save'));
      });
    };

    it('should post a new client and not call mutate', async () => {
      poster.mockResolvedValue({ client: { ...clients[0], id: 10 } });

      await act(async () => {
        render(<Clients />);
      });
      await fillClient();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith('/persons/client', {
        firstName: 'Test',
        lastName: 'Client',
        gender: Gender.OTHER,
        email: 'test@client.com',
        phone: '123 123 123',
        covidPassport: true,
        password: 'AABBCCDD', // It is the gym code
        gym: 1
      });
      // It should not call mutate as clients length === 15
      expect(mutateSpy).not.toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Client created!');
    });

    it('should post a new client and call mutate', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/persons/clients?skip=0') {
          return { data: [], mutate: mutateSpy } as any;
        } else if (key === '/persons/clients?skip=15') {
          return { data: clientsTwo } as any;
        }

        return {} as any;
      });
      poster.mockResolvedValue({ client: { ...clients[0], id: 10 } });

      await act(async () => {
        render(<Clients />);
      });
      await fillClient();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith('/persons/client', {
        firstName: 'Test',
        lastName: 'Client',
        gender: Gender.OTHER,
        email: 'test@client.com',
        phone: '123 123 123',
        covidPassport: true,
        password: 'AABBCCDD', // It is the gym code
        gym: 1
      });
      // It should not call mutate as clients length === 15
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledWith(
        [{ ...clients[0], id: 10 }],
        false
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Client created!');
    });

    it('should call onError on poster error', async () => {
      poster.mockRejectedValue('Error thrown');

      await act(async () => {
        render(<Clients />);
      });
      await fillClient();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(mutateSpy).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });

  describe('put client', () => {
    // This is a special case, when the user is allowed to delete clients,
    // but can't update them
    it('should not be able to update without permissions', async () => {
      (ctx.useAppContext as jest.Mock).mockReturnValue({
        token: { parsed: {} },
        user: { gym: { id: 1, code: 'AABBCCDD' } },
        todayEvents: [],
        helpers: { hasAccess: (key: string) => key === 'deleteClients' },
        API: { fetcher, poster, putter }
      });

      await act(async () => {
        render(<Clients />);
      });
      await act(async () => {
        fireEvent.click(screen.getByText(clients[0].firstName));
      });

      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    const fillClient = async () => {
      await act(async () => {
        fireEvent.click(screen.getByText(clients[0].firstName));
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'Updated' }
        });
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Save'));
      });
    };

    it('should update a client', async () => {
      await act(async () => {
        render(<Clients />);
      });
      await fillClient();

      expect(putter).toHaveBeenCalledTimes(1);
      expect(putter).toHaveBeenCalledWith('/persons/client', {
        id: clients[0].id,
        firstName: 'Updated',
        lastName: clients[0].lastName,
        gender: clients[0].gender,
        email: clients[0].email,
        password: clients[0].password,
        phone: clients[0].phone,
        covidPassport: true,
        gym: 1
      });
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Client updated successfully!');
    });

    it('should call onError on putter error', async () => {
      putter.mockRejectedValue({
        response: { data: { message: 'Error thrown' } }
      });

      await act(async () => {
        render(<Clients />);
      });
      await fillClient();

      expect(putter).toHaveBeenCalledTimes(1);
      expect(mutateSpy).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });

  it('should open and close the dialog', async () => {
    await act(async () => {
      render(<Clients />);
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-client'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
  });
});
