import { useFormContext } from 'react-hook-form';

import Input from '../../../../Input';

import { SettingsUserInfoFields } from '../types';

type LastNameProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

const LastName = ({ disabled = false }: LastNameProps) => {
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
      disabled={disabled}
      registerResult={register('lastName', { required: true })}
      fullWidth
    />
  );
};

export default LastName;
