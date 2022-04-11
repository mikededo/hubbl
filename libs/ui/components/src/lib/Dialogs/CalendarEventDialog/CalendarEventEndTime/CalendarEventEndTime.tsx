import { isTimeBefore } from '@hubbl/utils';
import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { CalendarEventFormFields } from '../../types';

const CalendarEventEndTime = (): JSX.Element => {
  const {
    getValues,
    register,
    formState: { errors }
  } = useFormContext<CalendarEventFormFields>();

  return (
    <TimeInput
      label="End time"
      title="calendar-event-end-time"
      placeholder="10:00"
      type="text"
      registerResult={register('endTime', {
        required: true,
        validate: (value) => isTimeBefore(value, getValues('startTime'))
      })}
      error={!!errors.endTime}
      fullWidth
    />
  );
};

export default CalendarEventEndTime;
