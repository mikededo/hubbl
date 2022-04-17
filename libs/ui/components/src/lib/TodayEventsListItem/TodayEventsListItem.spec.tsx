import { render, screen } from '@testing-library/react';

import TodayEventsListItem from './TodayEventsListItem';

const event = {
  id: 2,
  name: 'Monday Spinning',
  description: "Monday's Spinning event",
  capacity: 25,
  covidPassport: true,
  maskRequired: true,
  difficulty: 2,
  startTime: '09:00:00',
  endTime: '12:00:00',
  trainer: { id: 2, firstName: 'Trainer', lastName: 'One' },
  calendar: 1,
  template: {
    id: 1,
    name: 'Monday Spinning',
    description: "Monday's Spinning event",
    capacity: 25,
    covidPassport: true,
    maskRequired: true,
    difficulty: 2
  },
  eventType: {
    id: 1,
    name: 'Spinning event',
    description: 'Spinning event',
    labelColor: '#A78BFA'
  },
  date: { year: 2022, month: 4, day: 17 },
  appointmentCount: 0
};

describe('<TodayEventsListItem />', () => {
  it('should render properly', () => {
    render(<TodayEventsListItem event={event as any} />);

    expect(screen.getByText(event.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${event.appointmentCount}/${event.capacity}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${event.startTime} - ${event.endTime}`)
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Facial mask required')).toBeInTheDocument();
    expect(screen.getByTitle('mask-required')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Covid passport required')
    ).toBeInTheDocument();
    expect(screen.getByTitle('passport-required')).toBeInTheDocument();
  });

  it('should render the opposite icon titles', () => {
    render(
      <TodayEventsListItem
        event={{ ...event, covidPassport: false, maskRequired: false } as any}
      />
    );

    expect(screen.getByTitle('mask-not-required')).toBeInTheDocument();
    expect(screen.getByTitle('passport-not-required')).toBeInTheDocument();
  });
});
