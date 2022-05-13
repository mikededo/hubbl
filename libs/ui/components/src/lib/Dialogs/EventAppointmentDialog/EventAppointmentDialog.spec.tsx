import { render, screen } from '@testing-library/react';

import EventAppointmentDialog from './EventAppointmentDialog';

const event = {
  name: 'Event title',
  startTime: '09:00',
  endTime: '10:00',
  maskRequired: true,
  covidPassport: true,
  trainer: { firstName: 'Test', lastName: 'Trainer' },
  date: { year: 2022, month: 6, day: 29 }
};

describe('<EventAppointmentDialog />', () => {
  describe('open', () => {
    it('it should not render if not open', () => {
      render(<EventAppointmentDialog open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', async () => {
      render(<EventAppointmentDialog event={event as any} open />);

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(event.name)).toBeInTheDocument();
      expect(
        screen.getByText('Do you want to create an appointment for the event?')
      ).toBeInTheDocument();
    });
  });

  describe('event', () => {
    it('should render the event data', () => {
      render(<EventAppointmentDialog event={event as any} open />);

      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('29/06/2022')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(
        screen.getByText(`${event.startTime} - ${event.endTime}`)
      ).toBeInTheDocument();
      expect(screen.getByText('Mask required')).toBeInTheDocument();
      expect(screen.getByText('Covid passport')).toBeInTheDocument();
      expect(screen.getAllByText('Yes').length).toBe(2);
      expect(screen.getByText('Trainer')).toBeInTheDocument();
      expect(
        screen.getByText(`${event.trainer.firstName} ${event.trainer.lastName}`)
      ).toBeInTheDocument();
    });

    it('should render the event data with oppossite booleans', () => {
      render(
        <EventAppointmentDialog
          event={{ ...event, maskRequired: false, covidPassport: false } as any}
          open
        />
      );

      expect(screen.getAllByText('No').length).toBe(2);
    });
  });
});
