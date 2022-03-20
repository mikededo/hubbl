import { render, screen } from '@testing-library/react';

import DashboardEventTemplate from './DashboardEventTemplate';

describe('<DashboardEventTemplate />', () => {
  const event = {
    id: 10,
    name: 'Event name',
    date: { day: 29, month: 6, year: 2100 },
    startTime: '09:00',
    endTime: '10:00',
    appointmentCount: 15,
    capacity: 25
  };

  it('should render properly', () => {
    const { container } = render(
      <DashboardEventTemplate event={event as any} />
    );

    expect(container).toBeInTheDocument();
  });

  describe('event', () => {
    it('should render a event fields', () => {
      render(<DashboardEventTemplate event={event as any} />);

      expect(screen.getByText(event.name)).toBeInTheDocument();
      expect(screen.getByText('difficulty-one')).toBeInTheDocument();
      expect(screen.getByText('difficulty-two')).toBeInTheDocument();
      expect(screen.getByText('difficulty-three')).toBeInTheDocument();
      expect(screen.getByText('difficulty-four')).toBeInTheDocument();
      expect(screen.getByText('difficulty-five')).toBeInTheDocument();
    });
  });
});
