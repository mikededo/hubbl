import { useFormContext } from 'react-hook-form';

import { Person } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import Input from '../../../Input';
import { VirtualGymFormFields } from '../../types';

const VirtualGymCapacity = (): JSX.Element => {
  const { register } = useFormContext<VirtualGymFormFields>();

  return (
    <Input
      label="Capacity"
      title="virtual-gym-capacity"
      placeholder="200"
      type="number"
      registerResult={register('capacity', { required: true })}
      startAdornment={
        <InputAdornment position="start">
          <Person />
        </InputAdornment>
      }
      fullWidth
    />
  );
};

export default VirtualGymCapacity;
