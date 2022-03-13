import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { VirtualGymFormFields } from '../../types';

const VirtualGymName = (): JSX.Element => {
  const { register } = useFormContext<VirtualGymFormFields>();

  return (
    <Input
      label="Virtual gym name"
      title="virtual-gym-name"
      placeholder="New name"
      type="text"
      registerResult={register('name', { required: true })}
      fullWidth
    />
  );
};

export default VirtualGymName;
