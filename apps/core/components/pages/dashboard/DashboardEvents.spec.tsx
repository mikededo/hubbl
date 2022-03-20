import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { EventDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen, act } from '@testing-library/react';

import DashboardEvents from './DashboardEvents';

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
    difficulty: 3,
    startTime: '09:00',
    endTime: '10:00',
    calendar: 1,
    covidPassport: true,
    maskRequired: true,
    date: { day: 1, month: 1, year: 2100 }
  },
  {
    id: 2,
    name: 'Two',
    description: 'Two Description',
    capacity: 25,
    difficulty: 3,
    startTime: '10:00',
    endTime: '11:00',
    calendar: 1,
    covidPassport: true,
    maskRequired: true,
    date: { day: 1, month: 1, year: 2100 }
  },
  {
    id: 3,
    name: 'Three',
    description: 'Three Description',
    capacity: 25,
    difficulty: 3,
    startTime: '11:00',
    endTime: '12:00',
    calendar: 1,
    covidPassport: true,
    maskRequired: true,
    date: { day: 1, month: 1, year: 2100 }
  },
  {
    id: 4,
    name: 'Four',
    description: 'Four Description',
    capacity: 25,
    difficulty: 3,
    startTime: '12:00',
    endTime: '13:00',
    calendar: 1,
    covidPassport: true,
    maskRequired: true,
    date: { day: 1, month: 1, year: 2100 }
  },
  {
    id: 5,
    name: 'Five',
    description: 'Five Description',
    capacity: 25,
    difficulty: 3,
    startTime: '14:00',
    endTime: '15:00',
    calendar: 1,
    covidPassport: true,
    maskRequired: true,
    date: { day: 1, month: 1, year: 2100 }
  }
] as EventDTO[];

const renderComponent = () =>
  render(
    <LoadingContext>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <AppProvider>
            <DashboardEvents />
          </AppProvider>
        </ToastContext>
      </ThemeProvider>
    </LoadingContext>
  );

describe('<DashboardEvents />', () => {
  const fetcher = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'owner' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      API: { fetcher }
    } as any);
  });

  it('should render the list of events', async () => {
    jest.spyOn(swr, 'default').mockImplementation((cb, f, opt) => {
      expect(f).toBe(fetcher);
      if (cb) {
        expect(cb).toBe(`/dashboards/1`);
      }
      expect(opt).toStrictEqual({ revalidateOnFocus: false });

      return { data: { events: response } } as never;
    });

    await act(async () => {
      renderComponent();
    });

    // Find events
    response.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    // Find placeholder
    expect(screen.getByTitle('add-event')).toBeInTheDocument();
  });
});
