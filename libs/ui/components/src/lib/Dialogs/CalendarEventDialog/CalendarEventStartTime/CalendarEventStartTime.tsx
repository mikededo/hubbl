import { isTimeBefore } from '@hubbl/utils';
import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { CalendarEventFormFields } from '../../types';

const CalendarEventStartTime = (): JSX.Element => {
  const {
    getValues,
    register,
    formState: { errors }
  } = useFormContext<CalendarEventFormFields>();

  return (
    <TimeInput
      label="Start time"
      title="calendar-event-start-time"
      placeholder="09:00"
      type="text"
      registerResult={register('startTime', {
        required: true,
        validate: (value) => !isTimeBefore(value, getValues('endTime'))
      })}
      error={!!errors.startTime}
      fullWidth
    />
  );
};

export default CalendarEventStartTime;
