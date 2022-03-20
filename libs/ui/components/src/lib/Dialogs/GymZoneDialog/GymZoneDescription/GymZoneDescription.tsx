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
      label="Description"
      placeholder="New gym zone description"
      title="gym-zone-description"
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

export default GymZoneName;
