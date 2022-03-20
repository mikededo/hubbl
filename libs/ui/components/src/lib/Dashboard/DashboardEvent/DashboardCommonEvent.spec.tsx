import { render, screen } from '@testing-library/react';
import DashboardCommonEvent from './DashboardCommonEvent';

describe('<DashboardCommonEvent />', () => {
  const event = {
    id: 10,
    name: 'Event name',
    startTime: '09:00',
    endTime: '10:00',
    maskRequired: true,
    covidPassport: true,
    appointmentCount: 15,
    capacity: 25,
    difficulty: 3
  };

  // The other attributes are already tested in the DashboardCommonEvent
  // component
  it('should properly render', () => {
    render(<DashboardCommonEvent event={event as any} />);

    expect(screen.getByText(event.name)).toBeInTheDocument();
    // Find icons
    expect(screen.getByTitle('mask-required')).toBeInTheDocument();
    expect(screen.getByTitle('passport-required')).toBeInTheDocument();
  });
});
