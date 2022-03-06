import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';

import { SettingsUserInfoFields } from '../types';

const LastName = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="Last name"
      labelVariant="body1"
      title="lastName"
      type="text"
      placeholder="Doe"
      error={!!errors.lastName}
      registerResult={register('lastName', { required: true })}
      fullWidth
    />
  );
};

export default LastName;
