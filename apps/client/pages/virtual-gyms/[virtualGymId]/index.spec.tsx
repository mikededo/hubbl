import { useRouter } from 'next/router';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { AppProvider } from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

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
      { id: 1, name: 'GymZoneOne', calendar: 1, isClassType: false },
      { id: 2, name: 'GymZoneTwo', calendar: 2, isClassType: true },
      { id: 3, name: 'GymZoneThree', calendar: 3, isClassType: true },
      { id: 4, name: 'GymZoneFour', calendar: 4, isClassType: false },
      { id: 5, name: 'GymZoneFive', calendar: 5, isClassType: false },
      { id: 6, name: 'GymZoneSix', calendar: 6, isClassType: true }
    ]
  },
  error: null
};

const renderPage = () =>
  render(
    <AppProvider>
      <VirtualGym />
    </AppProvider>
  );

describe('Virtual gym page', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();

  const swrSpy = jest.spyOn(swr, 'default');

  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { id: 1, gym: { id: 1 } },
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
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render the list of virtual gyms', async () => {
    await act(async () => {
      renderPage();
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
      renderPage();
    });

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Data error');
  });

  it('should push to 404 on virtualGym fetch error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(() => ({ error: 'Error thrown' } as any));

    await act(async () => {
      renderPage();
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
    expect(useRouter().push).toHaveBeenCalledTimes(1);
    expect(useRouter().push).toHaveBeenCalledWith('/404');
  });

  describe('non-class gym zones', () => {
    const timesResponse = {
      data: [
        '09:00:00',
        '09:15:00',
        '09:30:00',
        '09:45:00',
        '10:00:00',
        '10:15:00',
        '10:30:00',
        '10:45:00',
        '11:00:00',
        '11:15:00',
        '11:30:00',
        '11:45:00'
      ]
    };
    const gymZone = virtualGymResponse.data.gymZones.find(
      ({ isClassType }) => !isClassType
    );

    beforeEach(() => {
      swrSpy.mockImplementation((key) => {
        if (key === '/virtual-gyms/1') {
          return virtualGymResponse as any;
        } else if (/(appointments\/calendars\/)/.test(key as string)) {
          return timesResponse;
        }

        return {};
      });
    });

    it('should open and close the appointment modal', async () => {
      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle(`gym-zone-${gymZone.id}`));
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('close-dialog'));
      });
    });

    it('should create a new appointment', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));
      poster.mockResolvedValue({
        id: 120,
        client: 1,
        calendar: gymZone.calendar,
        startTime: '09:00',
        endTime: '10:30',
        date: { year: 2022, month: 6, day: 29 }
      });

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle(`gym-zone-${gymZone.id}`));
      });
      await act(async () => {
        // Do not modify anything in the form, as it is already tested,
        // simply use the default values
        fireEvent.click(screen.getByText('Create'));
      });

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith('/appointments/calendars', {
        client: 1,
        calendar: gymZone.calendar,
        startTime: '09:00',
        endTime: '10:30',
        date: { year: 2022, month: 6, day: 29 }
      });

      // Expect the confirmation dialog to show up
      expect(screen.getByText('Appointment confirmation')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByTitle('close-dialog'));
      });
    });

    it('should all onError if posting an appointment fails', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));
      poster.mockRejectedValue({
        response: { data: { message: 'Error thrown' } }
      });

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle(`gym-zone-${gymZone.id}`));
      });
      await act(async () => {
        // Do not modify anything in the form, as it is already tested,
        // simply use the default values
        fireEvent.click(screen.getByText('Create'));
      });

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(poster).toHaveBeenCalledTimes(1);

      // Expect the confirmation dialog to show up
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });
});
