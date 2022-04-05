import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { useRouter } from 'next/router';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import GymZone from './index';
import { AppPalette } from '@hubbl/shared/types';

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

const initialWeekDate = (week: number): Date => {
  const initial = new Date();

  initial.setDate(
    initial.getDate() - initial.getDay() + (initial.getDay() == 0 ? -6 : 1)
  );
  initial.setDate(initial.getDate() - 7 * week);

  return initial;
};

const eventsResponse = (week: number): any[] => [
  {
    id: 1,
    name: 'EventOne',
    capacity: 5,
    startTime: '10:00:00',
    endTime: '12:00:00',
    color: AppPalette.RED,
    date: {
      year: initialWeekDate(week).getFullYear(),
      month: initialWeekDate(week).getMonth(),
      day: initialWeekDate(week).getDate()
    },
    appointmentCount: 1
  },
  {
    id: 2,
    name: 'EventTwo',
    description: 'EventTwo description',
    capacity: 5,
    startTime: '12:00:00',
    endTime: '14:00:00',
    color: AppPalette.EMERALD,
    date: {
      year: initialWeekDate(week).getFullYear(),
      month: initialWeekDate(week).getMonth(),
      day: new Date(
        initialWeekDate(week).getTime() + 60 * 60 * 24 * 1000
      ).getDate()
    },
    appointmentCount: 2
  }
];

const gymZoneResponse = {
  data: {
    id: 1,
    name: 'GymZoneName',
    openTime: '09:00:00',
    closeTime: '21:00:00',
    calendar: 1
  }
};

const prevWeekResponse = { data: eventsResponse(1) };

const currWeekResponse = { data: eventsResponse(0) };

const nextWeekResponse = { data: eventsResponse(-1) };

const calendarDateRange = (week: number): string => {
  const initial = initialWeekDate(week);

  const monday = new Date(initial);
  const sunday = new Date(initial);
  sunday.setDate(monday.getDate() + 6);

  const first = monday.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  const last = sunday.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  return `${first} - ${last}`;
};

const startDateParam = (week: number): string =>
  calendarDateRange(week).split(' - ')[0].split('/').reverse().join('-');

const renderPage = () =>
  render(
    <LoadingContext>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <AppProvider>
            <GymZone />
          </AppProvider>
        </ToastContext>
      </ThemeProvider>
    </LoadingContext>
  );

describe('Gym zone page', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();

  const swrSpy = jest.spyOn(swr, 'default');

  const onErrorSpy = jest.fn();
  const onSuccessSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    const pop = jest.fn();
    const push = jest.fn();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { gym: { id: 1 } },
      token: { parsed: {} },
      API: { fetcher, poster }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError: onErrorSpy,
      onSuccess: onSuccessSpy
    });
    (ctx.useLoadingContext as jest.Mock).mockReturnValue({
      loading: false,
      onPopLoading: pop,
      onPushLoading: push
    });
    swrSpy.mockImplementation((key) => {
      const prevStartDate = startDateParam(1);
      const currStartDate = startDateParam(0);
      const nextStartDate = startDateParam(-1);

      if (key === '/virtual-gyms/1/gym-zones/2') {
        return gymZoneResponse as any;
      } else if (key === `/calendars/1/events?startDate=${prevStartDate}`) {
        return prevWeekResponse as any;
      } else if (key === `/calendars/1/events?startDate=${currStartDate}`) {
        return currWeekResponse as any;
      } else if (key === `/calendars/1/events?startDate=${nextStartDate}`) {
        return nextWeekResponse as any;
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
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should iterate through the calendar', async () => {
    await act(async () => {
      renderPage();
    });

    expect(screen.getByText(gymZoneResponse.data.name)).toBeInTheDocument();
    // Find current week's date
    expect(screen.getByText(calendarDateRange(0))).toBeInTheDocument();
    // Find current week's events
    currWeekResponse.data.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('prev-week'));
    });

    // Find previous week's date
    expect(screen.getByText(calendarDateRange(1))).toBeInTheDocument();
    // Find previous week's events
    prevWeekResponse.data.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-week'));
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-week'));
    });

    // Find next week's date
    expect(screen.getByText(calendarDateRange(-1))).toBeInTheDocument();
    // Find next week's events
    nextWeekResponse.data.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('should render from 8h to 17h week if no gymZone', async () => {
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    screen.getByTitle('calendar').childNodes.forEach((node) => {
      expect(node.childNodes.length).toBe(10);
    });
  });

  it('should push to 404 on gymZone fetch error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(() => ({ error: 'Some error' } as any));

    await act(async () => {
      renderPage();
    });

    expect(useRouter().push).toHaveBeenCalledTimes(1);
    expect(useRouter().push).toHaveBeenCalledWith('/404');
  });

  it('should call onError if fetching events fails', async () => {
    swrSpy.mockClear().mockImplementation((key) => {
      if (key === '/virtual-gyms/1/gym-zones/2') {
        return gymZoneResponse as any;
      } else if (/\/calendars\//.test(key.toString())) {
        return { error: 'Error thrown' };
      }

      return {};
    });

    await act(async () => {
      renderPage();
    });

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith('Error thrown');
  });
});
