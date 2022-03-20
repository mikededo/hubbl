import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { VirtualGymFormFields } from '../../types';

const VirtualGymName = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<VirtualGymFormFields>();

  return (
    <Input
      label="Virtual gym name"
      title="virtual-gym-name"
      placeholder="New name"
      type="text"
      registerResult={register('name', { required: true })}
      error={!!errors.name}
      fullWidth
    />
  );
};

export default VirtualGymName;
