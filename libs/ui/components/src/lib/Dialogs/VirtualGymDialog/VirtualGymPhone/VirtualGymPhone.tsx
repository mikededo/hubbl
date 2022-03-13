import { useFormContext } from 'react-hook-form';

import { Phone } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import Input from '../../../Input';
import { VirtualGymFormFields } from '../../types';

const VirtualGymPhone = (): JSX.Element => {
  const { register } = useFormContext<VirtualGymFormFields>();

  return (
    <Input
      label="Phone"
      title="virtual-gym-phone"
      placeholder="000 000 000"
      type="tel"
      registerResult={register('phone', { required: true })}
      startAdornment={
        <InputAdornment position="start">
          <Phone />
        </InputAdornment>
      }
      fullWidth
    />
  );
};

export default VirtualGymPhone;
