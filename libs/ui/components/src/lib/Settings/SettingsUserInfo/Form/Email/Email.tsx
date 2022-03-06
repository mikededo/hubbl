import { useFormContext } from 'react-hook-form';

import Input from '../../../../Input';

import { SettingsUserInfoFields } from '../types';

const Email = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="Email"
      labelVariant="body1"
      title="email"
      type="email"
      placeholder="john.doe@domain.com"
      error={!!errors.email}
      registerResult={register('email', { required: true })}
      fullWidth
    />
  );
};

export default Email;
