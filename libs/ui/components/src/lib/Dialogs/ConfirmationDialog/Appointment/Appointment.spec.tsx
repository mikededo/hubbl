import { render, screen } from '@testing-library/react';

import CalendarAppointment from './Appointment';

describe('<CalendarAppointment />', () => {
  describe('open', () => {
    it('it should not render if not open', () => {
      render(<CalendarAppointment open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', async () => {
      render(<CalendarAppointment open />);

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Appointment confirmation')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Here you have the data of the appointment you have just created! ' +
            'Enjoy your workout!'
        )
      ).toBeInTheDocument();
    });
  });

  describe('appointment', () => {
    it('should render the appointment data', () => {
      const appointment = {
        id: 1500,
        startTime: '09:00',
        endTime: '10:30',
        date: { year: 2022, month: 6, day: 29 }
      };

      render(<CalendarAppointment appointment={appointment as any} open />);

      expect(screen.getByText('Appointment number')).toBeInTheDocument();
      expect(screen.getByText(appointment.id)).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(
        screen.getByText(
          `${appointment.date.day}/0${appointment.date.month}/${appointment.date.year}`
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Start time')).toBeInTheDocument();
      expect(screen.getByText(appointment.startTime)).toBeInTheDocument();
      expect(screen.getByText('End time')).toBeInTheDocument();
      expect(screen.getByText(appointment.endTime)).toBeInTheDocument();
    });
  });
});
