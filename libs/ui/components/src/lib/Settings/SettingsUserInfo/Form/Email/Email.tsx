import { useFormContext } from 'react-hook-form';

import Input from '../../../../Input';

import { SettingsUserInfoFields } from '../types';

type EmailProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

const Email = ({ disabled = false }: EmailProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="Email"
      labelVariant="body1"
      inputProps={{ title: 'user-email' }}
      type="email"
      placeholder="john.doe@domain.com"
      error={!!errors.email}
      disabled={disabled}
      registerResult={register('email', { required: true })}
      fullWidth
    />
  );
};

export default Email;
