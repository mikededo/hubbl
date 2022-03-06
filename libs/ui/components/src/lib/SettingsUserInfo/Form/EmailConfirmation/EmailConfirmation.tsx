import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';

import { SettingsUserInfoFields } from '../types';

const EmailConfirmation = () => {
  const {
    getValues,
    register,
    formState: { errors }
  } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="Confirm email"
      labelVariant="body1"
      title="confirmationEmail"
      type="email"
      placeholder="Repeat the email"
      error={!!errors.emailConfirmation}
      registerResult={register('emailConfirmation', {
        required: true,
        validate: (value) => value === getValues('email')
      })}
      fullWidth
    />
  );
};

export default EmailConfirmation;
