import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { VirtualGymFormFields } from '../../types';

const VirtualGymPhone = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<VirtualGymFormFields>();

  return (
    <Input
      label="Location"
      title="virtual-gym-location"
      placeholder="Somewhere, There, 90"
      type="text"
      registerResult={register('location', { required: true })}
      error={!!errors.location}
      fullWidth
    />
  );
};

export default VirtualGymPhone;
