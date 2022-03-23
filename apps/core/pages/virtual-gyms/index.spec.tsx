import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    useMediaQuery: jest.fn(() => false)
  };
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

const renderPage = () =>
  render(
    <AppProvider>
      <LoadingContext>
        <ThemeProvider theme={createTheme()}>
          <ToastContext>
            <VirtualGyms />
          </ToastContext>
        </ThemeProvider>
      </LoadingContext>
    </AppProvider>
  );

const fillVirtualGymFields = async () => {
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
};

const fillGymZoneFields = async () => {
  await act(async () => {
    fireEvent.input(screen.getByPlaceholderText('New name'), {
      target: { name: 'name', value: 'Name' }
    });
    fireEvent.input(screen.getByPlaceholderText('New gym zone description'), {
      target: { name: 'description', value: 'Gym description' }
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
};

describe('Virtual gyms page', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1 } },
      API: { fetcher, poster }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError, onSuccess });
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

  it('should render the list of virtual gyms and gym zones', async () => {
    swrSpy.mockImplementation(() => response as any);

    await act(async () => {
      renderPage();
    });

    response.data.forEach(({ name, gymZones }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();

      gymZones.forEach(({ name }) => {
        expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
      });
    });
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: undefined },
      API: { fetcher, poster }
    });
    swrSpy.mockImplementation(() => ({}) as any);

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  describe('Virtual gym', () => {
    it('should open and close the virtual gym modal', async () => {
      swrSpy.mockImplementation(() => response as any);

      await act(async () => {
        renderPage();
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

    it('should post a new virtual gym', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation((key) => {
        if (key === '/virtual-gyms') {
          return { ...response, mutate: mutateSpy } as any;
        }

        return {} as any;
      });
      poster.mockImplementation(() => response.data[0]);

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-virtual-gym'));
      });
      // Fill fields
      await fillVirtualGymFields();

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
      expect(mutateSpy).toHaveBeenCalledWith(
        [...response.data, response.data[0]],
        false
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('should call onError if call fails', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation((key) => {
        if (key === '/virtual-gyms') {
          return { ...response, mutate: mutateSpy } as any;
        }

        return {} as any;
      });
      poster.mockRejectedValue('Error thrown');

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-virtual-gym'));
      });
      // Fill fields
      await fillVirtualGymFields();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Gym zone', () => {
    it('should open and close the gym zone modal', async () => {
      swrSpy.mockImplementation(() => response as any);

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(
          screen.getByTitle(`add-gym-zone-${response.data[0].id}`)
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('close-dialog'));
      });
      await waitForElementToBeRemoved(screen.queryByRole('dialog'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should post a new virtual gym', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation(
        () => ({ ...response, mutate: mutateSpy } as any)
      );
      poster.mockImplementation(() => ({ ...response.data[0], id: 5 }));

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(
          screen.getByTitle(`add-gym-zone-${response.data[0].id}`)
        );
      });
      // Fill fields
      await fillGymZoneFields();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith(
        `/virtual-gyms/${response.data[0].id}/gym-zones`,
        {
          name: 'Name',
          description: 'Gym description',
          capacity: 25,
          openTime: '10:00',
          closeTime: '22:00',
          isClassType: false,
          maskRequired: true,
          covidPassport: true,
          virtualGym: response.data[0].id,
          gym: 1
        }
      );
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledWith(
        response.data.map((vg) => {
          if (vg.id !== 0) {
            return vg;
          }

          vg.gymZones.push({ ...response.data[0], id: 5 });
          return vg;
        })
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('should call onError if call fails', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation(
        () => ({ ...response, mutate: mutateSpy } as any)
      );
      poster.mockRejectedValue(() => 'Error thrown');

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(
          screen.getByTitle(`add-gym-zone-${response.data[0].id}`)
        );
      });
      // Fill fields
      await fillGymZoneFields();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });
});
