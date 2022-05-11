import { FormProvider, useForm } from 'react-hook-form';

import { GymZoneIntervals } from '@hubbl/shared/types';
import { act, render, screen } from '@testing-library/react';

import { CalendarAppointmentFormFields } from '../../types';
import CalendarAppointmentEndTime from './CalendarAppointmentEndTime';

const Component = ({ interval = GymZoneIntervals.HOUR }) => {
  const methods = useForm<CalendarAppointmentFormFields>({
    defaultValues: { startTime: '09:00', interval }
  });

  return (
    <FormProvider {...methods}>
      <CalendarAppointmentEndTime />
    </FormProvider>
  );
};

describe('<CalendarAppointmentEndTime />', () => {
  it('should render properly', async () => {
    await act(async () => {
      render(<Component />);
    });

    expect(
      screen.getByTitle('calendar-appointment-end-time')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('calendar-appointment-end-time').firstChild
    ).toBeDisabled();
  });
});
