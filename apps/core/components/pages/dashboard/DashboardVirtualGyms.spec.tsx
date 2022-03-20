import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardVirtualGyms from './DashboardVirtualGyms';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');

  return { ...actual, useAppContext: jest.fn() };
});
jest.mock('axios');

const response = [
  {
    id: 1,
    name: 'One',
    description: 'One Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    gym: 1,
    location: 'One Location',
    phone: '000 000 000'
  },
  {
    id: 2,
    name: 'Two',
    description: 'Two Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    gym: 1,
    location: 'Two Location',
    phone: '000 000 000'
  },
  {
    id: 3,
    name: 'Three',
    description: 'Three Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    gym: 1,
    location: 'Three Location',
    phone: '000 000 000'
  },
  {
    id: 4,
    name: 'Four',
    description: 'Four Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    gym: 1,
    location: 'Four Location',
    phone: '000 000 000'
  },
  {
    id: 5,
    name: 'Five',
    description: 'Five Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    gym: 1,
    location: 'Five Location',
    phone: '000 000 000'
  }
] as VirtualGymDTO[];

const renderComponent = () =>
  render(
    <LoadingContext>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <AppProvider>
            <DashboardVirtualGyms />
          </AppProvider>
        </ToastContext>
      </ThemeProvider>
    </LoadingContext>
  );

describe('<DasboardVirtualGyms/>', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'owner' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      API: { fetcher, poster }
    } as any);
  });

  it('should not fetch without a token', async () => {
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {},
      user: {},
      API: {}
    } as any);
    jest.spyOn(swr, 'default').mockImplementation((cb) => {
      expect(cb).toBe(null);

      return {} as never;
    });

    await act(async () => {
      renderComponent();
    });
  });

  it('should render the list of gyms', async () => {
    jest.spyOn(swr, 'default').mockImplementation((cb, f, opt) => {
      expect(f).toBe(fetcher);
      expect(cb).toBe(`/dashboards/1`);
      expect(opt).toStrictEqual({ revalidateOnFocus: false });

      return { data: { virtualGyms: response } } as never;
    });

    await act(async () => {
      renderComponent();
    });

    // Find gyms
    response.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
    // Find placeholder
    expect(screen.getByTitle('add-virtual-gym')).toBeInTheDocument();
  });

  it('should create a new gym', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    jest
      .spyOn(swr, 'default')
      .mockImplementation(
        () => ({ data: { virtualGyms: [] }, mutate: mutateSpy } as never)
      );
    poster.mockImplementation(() => response[0]);

    await act(async () => {
      renderComponent();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-virtual-gym'));
    });
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('New name'), {
        target: { name: 'name', value: 'Name' }
      });
      fireEvent.input(
        screen.getByPlaceholderText('New virtual gym description'),
        { target: { name: 'description', value: 'Gym description' } }
      );
      fireEvent.input(screen.getByPlaceholderText('Somewhere, There, 90'), {
        target: { name: 'location', value: 'Some, Location, 90' }
      });
      fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
        target: { name: 'phone', value: '111 222 333' }
      });
      fireEvent.input(screen.getByPlaceholderText('200'), {
        target: { name: 'capacity', value: '25' }
      });
      userEvent.type(screen.getByPlaceholderText('09:00'), '10:00');
      userEvent.type(screen.getByPlaceholderText('23:00'), '22:00');
    });
    await act(async () => {
      userEvent.click(screen.getByText('Save'));
    });

    expect(poster).toHaveBeenCalledTimes(1);
    expect(poster).toHaveBeenCalledWith('/virtual-gyms', {
      name: 'Name',
      description: 'Gym description',
      location: 'Some, Location, 90',
      phone: '111 222 333',
      capacity: 25,
      openTime: '10:00',
      closeTime: '22:00',
      gym: 1
    });
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith({ virtualGyms: [response[0]] });
  });

  it('should close the dialog', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    jest
      .spyOn(swr, 'default')
      .mockImplementation(
        () => ({ data: { virtualGyms: [] }, mutate: mutateSpy } as never)
      );

    await act(async () => {
      renderComponent();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-virtual-gym'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
    await waitForElementToBeRemoved(screen.queryByRole('dialog'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
