import { useRouter } from 'next/router';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { AppProvider } from '@hubbl/data-access/contexts';
import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, render, screen, fireEvent } from '@testing-library/react';

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

const initialWeekDate = (week: number): Date => {
  const initial = new Date('2022/04/04');

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
    description: 'EventOne description',
    capacity: 5,
    startTime: '10:00:00',
    endTime: '12:00:00',
    eventType: { id: 1, name: 'EventTypeOne', labelColor: AppPalette.RED },
    date: {
      year: initialWeekDate(week).getFullYear(),
      month: initialWeekDate(week).getMonth() + 1,
      day: initialWeekDate(week).getDate()
    },
    maskRequired: true,
    covidPassport: true,
    difficulty: 3,
    template: null,
    trainer: { id: 1, name: 'Trainer' },
    appointmentCount: 1
  },
  {
    id: 2,
    name: 'EventTwo',
    description: 'EventTwo description',
    capacity: 5,
    startTime: '12:00:00',
    endTime: '14:00:00',
    eventType: { id: 2, name: 'EventTypeTwo', labelColor: AppPalette.EMERALD },
    date: {
      year: initialWeekDate(week).getFullYear(),
      month: initialWeekDate(week).getMonth() + 1,
      day: 10
    },
    maskRequired: true,
    covidPassport: true,
    difficulty: 3,
    template: null,
    trainer: { id: 1, name: 'Trainer' },
    appointmentCount: 2
  }
];

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
      const prevStartDate = startDateParam(1);
      const currStartDate = startDateParam(0);
      const nextStartDate = startDateParam(-1);

      if (key === '/virtual-gyms/1') {
        return virtualGymResponse as any;
      } else if (key === '/virtual-gyms/1/gym-zones/2') {
        return gymZoneResponse as any;
      } else if (key === `/calendars/1/events?startDate=${prevStartDate}`) {
        return prevWeekResponse as any;
      } else if (key === `/calendars/1/events?startDate=${currStartDate}`) {
        return { ...currWeekResponse } as any;
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
});
