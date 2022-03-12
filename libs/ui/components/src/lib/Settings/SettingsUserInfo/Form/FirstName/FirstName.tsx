import { useFormContext } from 'react-hook-form';

import Input from '../../../../Input';

import { SettingsUserInfoFields } from '../types';

type FirstNameProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

const FirstName = ({ disabled = false }: FirstNameProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="First name"
      labelVariant="body1"
      inputProps={{ title: 'user-first-name' }}
      type="text"
      placeholder="John"
      error={!!errors.firstName}
      disabled={disabled}
      registerResult={register('firstName', { required: true })}
      fullWidth
    />
  );
};

export default FirstName;
