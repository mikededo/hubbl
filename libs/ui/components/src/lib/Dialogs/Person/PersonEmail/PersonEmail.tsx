import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { PersonFormFields } from '../../types';

const PersonEmail = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PersonFormFields>();

  return (
    <Input
      label="Email"
      title="person-email"
      placeholder="john@doe.com"
      type="email"
      registerResult={register('email', { required: true })}
      error={!!errors.email}
      fullWidth
    />
  );
};

export default PersonEmail;
