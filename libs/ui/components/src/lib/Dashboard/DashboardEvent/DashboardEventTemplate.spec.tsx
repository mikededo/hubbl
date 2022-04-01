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
    capacity: 25,
    difficulty: 5
  };

  it.each([
    { ...event, difficulty: 1 },
    { ...event, difficulty: 2 },
    { ...event, difficulty: 3 },
    { ...event, difficulty: 4 },
    { ...event, difficulty: 5 }
  ])('should render properly for difficulty $difficulty', (event) => {
    const { container } = render(
      <DashboardEventTemplate event={event as any} />
    );

    expect(container).toBeInTheDocument();
  });

  describe('event', () => {
    it('should render a event fields', () => {
      render(<DashboardEventTemplate event={event as any} />);

      expect(screen.getByText(event.name)).toBeInTheDocument();
      expect(screen.getByText('difficulty-one-active')).toBeInTheDocument();
      expect(screen.getByText('difficulty-two-active')).toBeInTheDocument();
      expect(screen.getByText('difficulty-three-active')).toBeInTheDocument();
      expect(screen.getByText('difficulty-four-active')).toBeInTheDocument();
      expect(screen.getByText('difficulty-five-active')).toBeInTheDocument();
    });
  });
});
