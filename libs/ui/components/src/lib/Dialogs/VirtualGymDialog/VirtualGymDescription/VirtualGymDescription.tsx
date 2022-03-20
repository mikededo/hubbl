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
      label="Description"
      placeholder="New virtual gym description"
      title="virtual-gym-description"
      type="textarea"
      registerResult={register('description', {
        required: true,
        maxLength: 255
      })}
      rows={4}
      error={!!errors.description}
      multiline
      fullWidth
    />
  );
};

export default VirtualGymName;
