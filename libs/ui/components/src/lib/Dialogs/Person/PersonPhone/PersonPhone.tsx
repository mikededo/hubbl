import { useFormContext } from 'react-hook-form';

import { Phone } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import Input from '../../../Input';
import { PersonFormFields } from '../../types';

const PersonPhone = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PersonFormFields>();

  return (
    <Input
      label="Phone"
      title="person-phone"
      placeholder="000 000 000"
      type="tel"
      registerResult={register('phone')}
      error={!!errors.phone}
      startAdornment={
        <InputAdornment position="start">
          <Phone />
        </InputAdornment>
      }
      fullWidth
    />
  );
};

export default PersonPhone;
