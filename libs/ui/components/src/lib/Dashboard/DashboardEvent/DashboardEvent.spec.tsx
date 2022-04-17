import { render, screen } from '@testing-library/react';

import DashboardEvent from './DashboardEvent';

describe('<DashboardEvent />', () => {
  const event = {
    id: 10,
    name: 'Event name',
    date: { day: 29, month: 6, year: 2100 },
    startTime: '09:00',
    endTime: '10:00',
    maskRequired: true,
    covidPassport: true,
    appointmentCount: 15,
    capacity: 25
  };

  // The other attributes are already tested in the DashboardCommonEvent
  // component
  it('should render a event fields', () => {
    render(<DashboardEvent event={event as any} />);

    expect(screen.getByText(event.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${event.date.day}/${`${event.date.month}`.padStart(2, '0')}/${
          event.date.year
        }`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${event.startTime}-${event.endTime}`)
    ).toBeInTheDocument();
    expect(`${event.appointmentCount}/${event.capacity}`);
  });
});
