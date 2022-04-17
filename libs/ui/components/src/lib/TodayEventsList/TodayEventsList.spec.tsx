import { createTheme, ThemeProvider } from '@mui/material';
import { act, render, screen, fireEvent } from '@testing-library/react';

import TodayEventsList from './TodayEventsList';

const eventsList = [
  {
    id: 1,
    name: 'Event1',
    capacity: 25,
    covidPassport: true,
    maskRequired: true,
    difficulty: 2,
    startTime: '12:00:00',
    endTime: '13:00:00',
    eventType: { id: 1, name: 'Spinning event', labelColor: '#A78BFA' },
    appointmentCount: 0
  },
  {
    id: 2,
    name: 'Event2',
    capacity: 25,
    covidPassport: true,
    maskRequired: true,
    difficulty: 2,
    startTime: '09:00:00',
    endTime: '12:00:00',
    eventType: { id: 1, name: 'Spinning event', labelColor: '#A78BFA' },
    appointmentCount: 0
  },
  {
    id: 4,
    name: 'Event4',
    capacity: 25,
    covidPassport: true,
    maskRequired: true,
    difficulty: 2,
    startTime: '13:00:00',
    endTime: '13:30:00',
    eventType: { id: 1, name: 'Spinning event', labelColor: '#A78BFA' },
    appointmentCount: 0
  },
  {
    id: 3,
    name: 'Event3',
    capacity: 25,
    covidPassport: true,
    maskRequired: true,
    difficulty: 2,
    startTime: '14:00:00',
    endTime: '15:30:00',
    eventType: { id: 1, name: 'Spinning event', labelColor: '#A78BFA' },
    appointmentCount: 0
  }
];

describe('<TodayEventsList />', () => {
  it('should render properly', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <TodayEventsList events={eventsList as any} />
      </ThemeProvider>
    );

    expect(screen.getByText("Today's events")).toBeInTheDocument();
    eventsList.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('should render without events', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <TodayEventsList events={[]} />
      </ThemeProvider>
    );

    expect(screen.getByText("Today's events")).toBeInTheDocument();
    expect(
      screen.getByText("There are no event's left for today!")
    ).toBeInTheDocument();
  });

  it('should hide the list', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <TodayEventsList events={[]} />
      </ThemeProvider>
    );

    expect(screen.getByLabelText('hide-events-list'));

    await act(async () => {
      fireEvent.click(screen.getByLabelText('hide-events-list'));
    });

    expect(screen.getByLabelText('show-events-list'));
  });
});
