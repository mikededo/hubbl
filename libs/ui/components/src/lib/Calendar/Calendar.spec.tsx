import { AppPalette } from '@hubbl/shared/types';
import { screen, render } from '@testing-library/react';

import Calendar from './Calendar';

const events = [
  {
    id: 1,
    name: 'EventOne',
    description: 'EventOne description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '6:00:00',
    endTime: '12:00:00',
    color: AppPalette.RED,
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    },
    appointmentCount: 1
  },
  {
    id: 2,
    name: 'EventTwo',
    description: 'EventTwo description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '6:00:00',
    endTime: '7:00:00',
    color: AppPalette.EMERALD,
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getDate()
    },
    appointmentCount: 2
  },
  {
    id: 3,
    name: 'EventThree',
    description: 'EventThree description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '7:00:00',
    endTime: '8:30:00',
    color: AppPalette.BLUE,
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getDate()
    },
    appointmentCount: 3
  },
  {
    id: 4,
    name: 'EventFour',
    description: 'EventFour description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '9:00:00',
    endTime: '10:00:00',
    color: AppPalette.PURPLE,
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 3).getDate()
    },
    appointmentCount: 4
  }
];

describe('<Calendar />', () => {
  it('should render properly', () => {
    const { container } = render(
      <Calendar events={events as any} initialHour={6} finalHour={17} />
    );

    expect(container).toBeInTheDocument();
    // Find events
    events.forEach((e) => {
      expect(screen.getByText(e.name)).toBeInTheDocument();
      expect(
        screen.getByText(`${e.appointmentCount}/${e.capacity}`)
      ).toBeInTheDocument();
    });
  });
});