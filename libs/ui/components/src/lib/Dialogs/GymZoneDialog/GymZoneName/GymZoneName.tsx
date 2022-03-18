import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { GymZoneFormFields } from '../../types';

const GymZoneName = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<GymZoneFormFields>();

  return (
    <Input
      label="Gym zone name"
      title="gym-zone-name"
      placeholder="New name"
      type="text"
      registerResult={register('name', { required: true })}
      error={!!errors.name}
      fullWidth
    />
  );
};

export default GymZoneName;
