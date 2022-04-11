import { useFormContext } from 'react-hook-form';

import { Person } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import Input from '../../../Input';
import { CalendarEventFormFields } from '../../types';

const CalendarEventCapacity = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<CalendarEventFormFields>();

  return (
    <Input
      label="Capacity"
      title="calendar-event-capacity"
      placeholder="200"
      type="number"
      registerResult={register('capacity', {
        required: true,
        valueAsNumber: true
      })}
      startAdornment={
        <InputAdornment position="start">
          <Person />
        </InputAdornment>
      }
      error={!!errors.capacity}
    />
  );
};

export default CalendarEventCapacity;
