import { useRouter } from 'next/router';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

const prevWeekResponse = { data: eventsResponse(1) };

const currWeekResponse = { data: eventsResponse(0) };

const nextWeekResponse = { data: eventsResponse(-1) };

// Api responses for the dialog
const dialogEventTypeResponse = {
  data: [
    { id: 1, name: 'EventTypeOne' },
    { id: 2, name: 'EventTypeTwo' }
  ]
};
const dialogEventTemplatesResponse = {
  data: [
    { id: 1, name: 'EventTemplateOne', type: { id: 1, name: 'EventTypeOne' } },
    { id: 2, name: 'EventTemplateTwo', type: { id: 1, name: 'EventTypeOne' } }
  ]
};
const dialogGymZonesResponse = {
  data: [
    { id: 1, name: 'GymZoneOne' },
    { id: 2, name: 'GymZoneTwo' }
  ]
};
const dialogTrainersResponse = {
  data: [
    { id: 1, firstName: 'Triner', lastName: 'One' },
    { id: 2, firstName: 'Triner', lastName: 'Two' }
  ]
};

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
  const putter = jest.fn();
  const eventsApi = { revalidate: jest.fn() };

  const swrSpy = jest.spyOn(swr, 'default');
  const mutateSpy = jest.fn();

  const onErrorSpy = jest.fn();
  const onSuccessSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2022/04/04'));

    const pop = jest.fn();
    const push = jest.fn();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { gym: { id: 1 } },
      token: { parsed: {} },
      todayEvents: [],
      helpers: { hasAccess: () => true },
      API: { fetcher, poster, putter, todayEvents: eventsApi }
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
        return { ...currWeekResponse, mutate: mutateSpy } as any;
      } else if (key === `/calendars/1/events?startDate=${nextStartDate}`) {
        return nextWeekResponse as any;
      } else if (key === '/event-types') {
        return dialogEventTypeResponse as any;
      } else if (key === '/event-templates') {
        return dialogEventTemplatesResponse as any;
      } else if (key === '/virtual-gyms/1/gym-zones') {
        return dialogGymZonesResponse as any;
      } else if (key === '/persons/trainers') {
        return dialogTrainersResponse as any;
      }

      return {} as any;
    });
  });

  const fillEventForm = async () => {
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('New name'), {
        target: { name: 'name', value: 'Name' }
      });
      fireEvent.input(
        screen.getByPlaceholderText('New calendar event description'),
        {
          target: {
            name: 'description',
            value: 'Calendar event description'
          }
        }
      );
      fireEvent.input(screen.getByPlaceholderText('200'), {
        target: { name: 'capacity', value: '25' }
      });
      userEvent.type(screen.getByPlaceholderText('09:00'), '11:00');
      userEvent.type(screen.getByPlaceholderText('10:00'), '12:00');
    });
    await act(async () => {
      userEvent.click(screen.getByText('Save'));
    });
  };

  const createEvent = async (
    timerDate: string,
    dateInput: string,
    spot: number
  ) => {
    jest.useFakeTimers().setSystemTime(new Date(timerDate));
    poster.mockResolvedValue({ ...eventsResponse(0)[0], id: 10 });

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(screen.getAllByTestId('calendar-spot')[spot]);
    });

    // Check dialog is opened with wanted fields selected
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('dd/mm/yyyy')).toHaveValue(dateInput);
    expect(screen.getByPlaceholderText('09:00')).toHaveValue('10:00');
    expect(screen.getByPlaceholderText('10:00')).toHaveValue('11:00');

    // Fill the form
    await fillEventForm();

    // Api calls
    expect(poster).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledTimes(1);
  };

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

  it('should open and close the dialog ', async () => {
    poster.mockResolvedValue({ ...eventsResponse(0)[0], id: 10 });

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      // Select the second so that the placeholder does not match
      // the hours
      fireEvent.click(screen.getAllByTestId('calendar-spot')[1]);
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
  });

  it('should post a new event (on a non sunday day)', async () => {
    await createEvent('2022/04/04', '04/04/2022', 1);

    expect(eventsApi.revalidate).toHaveBeenCalledTimes(1);
  });

  it('should post a new event (on a sunday day)', async () => {
    await createEvent('2022/04/10', '10/04/2022', 73);

    expect(eventsApi.revalidate).not.toHaveBeenCalled();
  });

  it('should call onError if event creation fails', async () => {
    poster.mockRejectedValue({
      // Mock axios error response
      response: { data: { message: 'Error thrown' } }
    });

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(screen.getAllByTestId('calendar-spot')[1]);
    });
    await fillEventForm();

    // Api calls
    expect(poster).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledTimes(0);
    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith('Error thrown');
  });

  // This is a special case, when the user is allowed to delete events,
  // but can't update them
  it('should not be able to update without permissions', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { gym: { id: 1 } },
      token: { parsed: {} },
      todayEvents: [],
      helpers: { hasAccess: (key: string) => key === 'deleteEvents' },
      API: { fetcher, todayEvents: eventsApi }
    } as any);

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      userEvent.click(screen.getByText('EventOne').parentElement.parentElement);
    });

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  const updateEvent = async (eventName: string) => {
    putter.mockResolvedValue({});

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      userEvent.click(screen.getByText(eventName).parentElement.parentElement);
    });

    expect(screen.getByText('Edit an event')).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('New name'), {
        target: { name: 'name', value: 'Updated name' }
      });
    });
    await act(async () => {
      userEvent.click(screen.getByText('Save'));
    });

    // Api calls
    expect(putter).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledTimes(1);
  };

  it("should update an event (a today's event)", async () => {
    await updateEvent('EventOne');

    expect(putter).toHaveBeenCalledWith('events', {
      calendar: 1,
      capacity: 5,
      covidPassport: true,
      date: { day: 4, month: 4, year: 2022 },
      description: 'EventOne description',
      difficulty: 3,
      endTime: '12:00:00',
      eventType: 1,
      gym: 1,
      id: 1,
      maskRequired: true,
      startTime: '10:00:00',
      template: undefined,
      trainer: 1,
      name: 'Updated name'
    });
    expect(eventsApi.revalidate).toHaveBeenCalled();
  });

  it("should update an event (not a today's event)", async () => {
    await updateEvent('EventTwo');

    expect(putter).toHaveBeenCalledWith('events', {
      calendar: 1,
      capacity: 5,
      covidPassport: true,
      date: { day: 10, month: 4, year: 2022 },
      description: 'EventTwo description',
      difficulty: 3,
      endTime: '14:00:00',
      eventType: 2,
      gym: 1,
      id: 2,
      maskRequired: true,
      startTime: '12:00:00',
      template: undefined,
      trainer: 1,
      name: 'Updated name'
    });
    expect(eventsApi.revalidate).not.toHaveBeenCalled();
  });

  it('should call onError if event updation fails', async () => {
    putter.mockRejectedValue({
      // Mock axios error response
      response: { data: { message: 'Error thrown' } }
    });

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('EventOne').parentElement.parentElement);
    });

    expect(screen.getByText('Edit an event')).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('New name'), {
        target: { name: 'name', value: 'Updated name' }
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });

    // Api calls
    expect(putter).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledTimes(0);
    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith('Error thrown');
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
