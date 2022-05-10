import { useEffect } from 'react';

import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { CalendarAppointmentFormFields } from '../../types';

const CalendarAppointmentEndTime = (): JSX.Element => {
  const { register, setValue, watch } =
    useFormContext<CalendarAppointmentFormFields>();

  const startTime = watch('startTime');
  const interval = watch('interval');

  useEffect(() => {
    if (startTime) {
      const [hour, minutes] = startTime.split(':');
      const hourInc = Math.floor(interval / 60);
      const minutesInc = (interval / 15) % 4;

      setValue(
        'endTime',
        `${`${+hour + hourInc}`.padStart(2, '0')}:${`${
          +minutes + minutesInc * 15
        }`.padStart(2, '0')}`
      );
    }
  }, [interval, startTime, setValue]);

  return (
    <Input
      registerResult={register('endTime')}
      label="End time"
      title="calendar-appointment-end-time"
      placeholder="Select the end time"
      disabled
      required
    />
  );
};

export default CalendarAppointmentEndTime;
