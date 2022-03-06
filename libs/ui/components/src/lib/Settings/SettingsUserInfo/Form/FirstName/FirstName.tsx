import { useFormContext } from 'react-hook-form';

import Input from '../../../../Input';

import { SettingsUserInfoFields } from '../types';

const FirstName = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="First name"
      labelVariant="body1"
      title="firstName"
      type="text"
      placeholder="John"
      error={!!errors.firstName}
      registerResult={register('firstName', { required: true })}
      fullWidth
    />
  );
};

export default FirstName;
