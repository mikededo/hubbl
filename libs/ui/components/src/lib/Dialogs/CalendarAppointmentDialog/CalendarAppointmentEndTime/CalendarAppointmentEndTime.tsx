import { GymZoneIntervals } from '@hubbl/shared/types';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { CalendarAppointmentFormFields } from '../../';
import Input from '../../../Input';

type CalendarAppointmentEndTimeProps = {
  interval: GymZoneIntervals;
};

const CalendarAppointmentEndTime = ({
  interval
}: CalendarAppointmentEndTimeProps): JSX.Element => {
  const { register, setValue, watch } =
    useFormContext<CalendarAppointmentFormFields>();

  const value = watch('startTime');
  console.log({ a: watch('endTime') });

  useEffect(() => {
    if (value) {
      const [hour, minutes] = value.split(':');
      const hourInc = Math.floor(interval / 60);
      const minutesInc = (interval / 15) % 4;

      setValue(
        'endTime',
        `${`${+hour + hourInc}`.padStart(2, '0')}:${`${
          +minutes + minutesInc * 15
        }`.padStart(2, '0')}`
      );
    }
  }, [interval, value, setValue]);

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
