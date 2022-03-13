import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';

const VirtualGymName = (): JSX.Element => {
  const { register } = useFormContext();

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
      multiline
      fullWidth
    />
  );
};

export default VirtualGymName;
