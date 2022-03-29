import { useFormContext } from 'react-hook-form';

import { Person } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import Input from '../../../Input';
import { GymZoneFormFields } from '../../types';

const GymZoneCapacity = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<GymZoneFormFields>();

  return (
    <Input
      label="Capacity"
      title="event-template-capacity"
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

export default GymZoneCapacity;
