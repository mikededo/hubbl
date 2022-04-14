import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { CalendarEventFormFields } from '../../types';

const CalendarEventName = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext<CalendarEventFormFields>();

  return (
    <Input
      label="Description"
      placeholder="New calendar event description"
      title="calendar-event-description"
      type="textarea"
      registerResult={register('description', {
        required: true,
        maxLength: 255
      })}
      rows={4}
      error={!!errors.description}
      disabled={!!watch('template')}
      multiline
      fullWidth
    />
  );
};

export default CalendarEventName;
